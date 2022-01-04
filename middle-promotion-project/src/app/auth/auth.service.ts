import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject,
         catchError,
         combineLatest,
         finalize,
         forkJoin,
         from,
         map, mergeMap, Observable, of, tap, throwError } from 'rxjs';
import { UserAuthCredentials, UserCredentials } from '../model/credentials.model';
import { UserAdditionalInfo, UserMainInfo, UserProfile } from '../model/user.model';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getAuth,
         signInWithPopup,
         FacebookAuthProvider,
         GoogleAuthProvider,
         UserCredential,
         sendPasswordResetEmail,
         signInWithEmailAndPassword,
         createUserWithEmailAndPassword,
         signOut
        } from "firebase/auth";
import { ChangePasswordReturnData, ReauthenticateReturnData, UpdateInformationData, UpdatePasswordData } from '../model/user-edit.model';

interface AuthConfig {
    isSignupMode: boolean;
    authCredentials: UserAuthCredentials | null,
    defaultSignin: boolean;
}

interface AddtitionalCredetialsInfo extends UserCredential {
    _tokenResponse: {
        email: string,
        localId: string,
        idToken: string,
        expiresIn: number,
        displayName: string,
        photoURL: string,
        isNewUser: boolean
    };
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user = new BehaviorSubject<UserProfile | null>(null);
    public tempToken: string = "";
    public errorOccured: boolean = false;
    private tokenExpirationTimer: ReturnType<typeof setTimeout> | null  = null;

    constructor(private http: HttpClient, private router: Router) {
        initializeApp(environment.firebaseConfig);
    }

    public signup(userCredentials: UserAuthCredentials): Observable<[UserAdditionalInfo, UserMainInfo]> {
        const auth = getAuth();
        const authConfig = {
            isSignupMode: true,
            authCredentials: userCredentials,
            defaultSignin: true
        }

        return this.authAlgorithm(
            from(createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)),
            authConfig
        );
    }

    public login(userCredentials: UserCredentials): Observable<[UserAdditionalInfo, UserMainInfo]> {
        const auth = getAuth();
        const authConfig = {
            isSignupMode: false,
            authCredentials: null,
            defaultSignin: true
        }

        return this.authAlgorithm(
            from(signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)),
            authConfig
        );
    }

    public facebookAuth(): Observable<[UserAdditionalInfo, UserMainInfo]> {
        const provider = new FacebookAuthProvider();
        return this.authenticateWithPopup(provider);
    }

    public googleAuth(): Observable<[UserAdditionalInfo, UserMainInfo]> {
        const provider = new GoogleAuthProvider();
        return this.authenticateWithPopup(provider);
    }

    private authenticateWithPopup(
        provider: GoogleAuthProvider | FacebookAuthProvider
    ): Observable<[UserAdditionalInfo, UserMainInfo]> {
        const auth = getAuth();
        const authConfig = {
            isSignupMode: false,
            authCredentials: null,
            defaultSignin: false
        }

        return this.authAlgorithm(
            from(signInWithPopup(auth, provider)),
            authConfig);
    }

    private handleAuthentication(additionalInfo: UserAdditionalInfo, mainInfo: UserMainInfo): void {
        const expirationDate = new Date(new Date().getTime() + mainInfo.expiresIn * 1000);
        const image = additionalInfo.avatar?.src ? additionalInfo.avatar.src : mainInfo.photoURL;
        const name = additionalInfo.information.name ? additionalInfo.information.name : mainInfo.displayName;

        const user = new UserProfile(mainInfo.email, mainInfo.localId, mainInfo.idToken, expirationDate,
            name, image, additionalInfo.information.age, additionalInfo.isDefaultUser);

        this.user.next(user);
        this.autoLogout(mainInfo.expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    public autoLogin(): void {
        const userData = localStorage.getItem('userData');

        if (!userData) {
            return;
        }

        const parsedUser: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
            name: string;
            age: number | null | undefined;
            image: string | undefined;
            isDefaultUser: boolean;
        } = JSON.parse(userData);

        const newLoadedUser = new UserProfile(
            parsedUser.email,
            parsedUser.id,
            parsedUser._token,
            new Date(parsedUser._tokenExpirationDate),
            parsedUser.name,
            parsedUser.image,
            parsedUser.age,
            parsedUser.isDefaultUser
        );

        if (newLoadedUser.token) {
            this.user.next(newLoadedUser);
            const expirationDuration =
                new Date(parsedUser._tokenExpirationDate).getTime() -
                new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    public logout(): void {
        this.user.next(null);
        this.tempToken = "";
        this.router.navigate(['/auth/login']);
        localStorage.removeItem('userData');

        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = null;

        const auth = getAuth();
        signOut(auth);
    }

    private autoLogout(expirationDuration: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        } , expirationDuration)
    }

    public resetPassword(email: string): Observable<void> {
        const auth = getAuth();
        return from(sendPasswordResetEmail(auth, email));
    }

    private saveUserDetails(uid: string, userDetails: UserAdditionalInfo): Observable<UserAdditionalInfo> {
        return this.http.put<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`,
             userDetails);
    }

    private fetchUserDetails(uid: string, isSignupMode: boolean): Observable<UserAdditionalInfo> {
        return combineLatest([this.http.get<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`),
            this.updateUserType(isSignupMode, uid)])
                .pipe(
                    map(([additionalInfo, updatedUserType]: [UserAdditionalInfo ,boolean]) => {
                        return {
                            ...additionalInfo,
                            isDefaultUser: updatedUserType
                        };
                    })
                );
    }

    private authAlgorithm(
        inputObservable$: Observable<UserCredential>,
        authConfig: AuthConfig
    ): Observable<[UserAdditionalInfo, UserMainInfo]> {
        return inputObservable$.pipe(
            map((resData: UserCredential) => {
                const dataParsed: AddtitionalCredetialsInfo = JSON.parse(JSON.stringify(resData));

                this.tempToken = dataParsed._tokenResponse.idToken;
                this.errorOccured = false;


                const user: UserMainInfo = {
                    email: dataParsed._tokenResponse.email,
                    localId: dataParsed._tokenResponse.localId,
                    idToken: dataParsed._tokenResponse.idToken,
                    expiresIn: +dataParsed._tokenResponse.expiresIn,
                    displayName: dataParsed._tokenResponse.displayName,
                    photoURL: resData.user.photoURL
                };

                return {
                    user: user,
                    isNewUser: dataParsed._tokenResponse.isNewUser
                }
            }),
            mergeMap((resData: { user: UserMainInfo, isNewUser: boolean | undefined}) => {
                const userDetails: UserAdditionalInfo = {
                    information: {
                        name: authConfig.authCredentials?.name ?
                            authConfig.authCredentials.name : resData.user.displayName,
                        age: authConfig.authCredentials?.age ? authConfig.authCredentials.age : null,
                    },
                    avatar: {
                        src: resData.user.photoURL ? resData.user.photoURL : ""
                    },
                    isDefaultUser: authConfig.defaultSignin
                }

                return forkJoin([resData.isNewUser || authConfig.isSignupMode ?
                        this.saveUserDetails(resData.user.localId, userDetails) :
                        this.fetchUserDetails(resData.user.localId, authConfig.defaultSignin),
                        of(resData.user)
                    ]);
            }),
            tap(([additionalInfo, mainInfo]: [UserAdditionalInfo, UserMainInfo]) => {
                this.handleAuthentication(
                    additionalInfo,
                    mainInfo
                );
            }),
            catchError((e) => {
                this.errorOccured = true;
                return throwError(() => new Error(e))
            }),
            finalize(() => {
                this.tempToken = "";
                !this.errorOccured && this.router.navigate(['/user-console/articles']);
            })
        );
    }

    public reauthenticateUser(data: UpdatePasswordData, email: string): Observable<ReauthenticateReturnData> {
        return this.http.post<ReauthenticateReturnData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
            environment.firebaseConfig.apiKey, {email, password: data.oldPassword, returnSecureToken: false});
    }

    public changePassword(idToken: string, password: string): Observable<ChangePasswordReturnData> {
        return this.http.post<ChangePasswordReturnData>
            ('https://identitytoolkit.googleapis.com/v1/accounts:update?key=' +
            environment.firebaseConfig.apiKey, {idToken, password});
    }

    public updateUserInfo(data: UpdateInformationData, uid: string): Observable<UserAdditionalInfo> {
        return this.http.put<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/information.json`,
             { age: data.age, name: data.firstName + ' ' + data.lastName});
    }

    public updateAvatar(avatar: string, uid: string): Observable<UserAdditionalInfo> {
        return this.http.put<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/avatar.json`,
            { src: avatar });
    }

    public updateUserType(isDefaultUser: boolean, uid: string | null): Observable<boolean> {
        return this.http.put<boolean>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/isDefaultUser.json`,
            isDefaultUser);
    }

    public updateUserProfile(name: string = '', age: number = 0, image = ''): void {
        const userData = localStorage.getItem('userData');

        if (!userData) {
            return;
        }

        const parsedUser: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
            name: string;
            age: number | null | undefined;
            image: string | undefined;
            isDefaultUser: boolean;
        } = JSON.parse(userData);

        const user = new UserProfile(
            parsedUser.email,
            parsedUser.id,
            parsedUser._token,
            new Date(parsedUser._tokenExpirationDate),
            name ? name : parsedUser.name,
            image ? image : parsedUser.image,
            age ? age : parsedUser.age,
            parsedUser.isDefaultUser
        );

        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
    }
}
