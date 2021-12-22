import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, finalize, forkJoin, from, map, mergeMap, Observable, of, tap, throwError, withLatestFrom } from 'rxjs';
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
import { ChangePasswordReturnData, UpdateInformationData, UpdatePasswordData } from '../model/user-edit.model';

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

    signup(userCredentials: UserAuthCredentials) {
        const auth = getAuth();
        return this.authAlgorithm(
            from(createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)),
            true, userCredentials
        );
    }

    login(userCredentials: UserCredentials) {
        const auth = getAuth();
        return this.authAlgorithm(
            from(signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password))
        );
    }

    facebookAuth() {
        const provider = new FacebookAuthProvider();
        return this.authenticateWithPopup(provider);
    }

    googleAuth() {
        const provider = new GoogleAuthProvider();
        return this.authenticateWithPopup(provider);
    }

    private authenticateWithPopup(provider: GoogleAuthProvider | FacebookAuthProvider) {
        const auth = getAuth();
        return this.authAlgorithm(from(signInWithPopup(auth, provider)));
    }

    private handleAuthentication(additionalInfo: UserAdditionalInfo, mainInfo: UserMainInfo) {
        const expirationDate = new Date(new Date().getTime() + mainInfo.expiresIn * 1000);
        const image = additionalInfo.avatar?.src ? additionalInfo.avatar.src : mainInfo.photoURL;
        const name = additionalInfo.information.name ? additionalInfo.information.name : mainInfo.displayName;

        const user = new UserProfile(mainInfo.email, mainInfo.localId, mainInfo.idToken, expirationDate,
            name, image, additionalInfo.information.age);

        this.user.next(user);
        this.autoLogout(mainInfo.expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    autoLogin() {
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
        } = JSON.parse(userData);

        const newLoadedUser = new UserProfile(
            parsedUser.email,
            parsedUser.id,
            parsedUser._token,
            new Date(parsedUser._tokenExpirationDate),
            parsedUser.name,
            parsedUser.image,
            parsedUser.age
        );

        if (newLoadedUser.token) {
            this.user.next(newLoadedUser);
            const expirationDuration =
                new Date(parsedUser._tokenExpirationDate).getTime() -
                new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
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

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        } , expirationDuration)
    }

    resetPassword(email: string) {
        const auth = getAuth();
        return from(sendPasswordResetEmail(auth, email));
    }

    private saveUserDetails(uid: string, userDetails: UserAdditionalInfo) {
        return this.http.put<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`,
             userDetails);
    }

    private fetchUserDetails(uid: string) {
        return this.http.get<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`);
    }

    private authAlgorithm(
        inputObservable$: Observable<any | UserCredential>,
        isSignupMode: boolean = false,
        authCredentials?: UserAuthCredentials
    ) {
        return inputObservable$.pipe(
            map((resData: any | UserCredential) => {
                this.tempToken = resData._tokenResponse.idToken;
                this.errorOccured = false;

                const user: UserMainInfo = {
                    email: resData._tokenResponse.email,
                    localId: resData._tokenResponse.localId,
                    idToken: resData._tokenResponse.idToken,
                    expiresIn: +resData._tokenResponse.expiresIn,
                    displayName: resData._tokenResponse.displayName,
                    photoURL: resData.user.photoURL
                };

                return {
                    user: user,
                    isNewUser: resData._tokenResponse.isNewUser
                }
            }),
            mergeMap((resData: { user: UserMainInfo, isNewUser: boolean | undefined}) => {
                const userDetails: UserAdditionalInfo = {
                    information: {
                        name: authCredentials?.name ? authCredentials.name : resData.user.displayName,
                        age: authCredentials?.age ? authCredentials.age : null,
                    },
                    avatar: {
                        src: resData.user.photoURL ? resData.user.photoURL : ""
                    }
                }

                return forkJoin([resData.isNewUser || isSignupMode ?
                        this.saveUserDetails(resData.user.localId, userDetails) :
                        this.fetchUserDetails(resData.user.localId),
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

    reauthenticateUser(data: UpdatePasswordData, email: string) {
        return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
            environment.firebaseConfig.apiKey, {email, password: data.oldPassword, returnSecureToken: false});
    }

    changePassword(idToken: string, password: string) {
        return this.http.post<ChangePasswordReturnData>
            ('https://identitytoolkit.googleapis.com/v1/accounts:update?key=' +
            environment.firebaseConfig.apiKey, {idToken, password});
    }

    updateUserInfo(data: UpdateInformationData, uid: string) {
        return this.http.put<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/information.json`,
             { age: data.age, name: data.firstName + ' ' + data.lastName});
    }

    updateAvatar(avatar: string, uid: string) {

        return this.http.put<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/avatar.json`,
            { src: avatar });
    }

    updateUserProfile(name: string = '', age: number = 0, image = '') {
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
        } = JSON.parse(userData);

        const user = new UserProfile(
            parsedUser.email,
            parsedUser.id,
            parsedUser._token,
            new Date(parsedUser._tokenExpirationDate),
            name ? name : parsedUser.name,
            image ? image : parsedUser.image,
            age ? age : parsedUser.age
        );

        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
    }
}
