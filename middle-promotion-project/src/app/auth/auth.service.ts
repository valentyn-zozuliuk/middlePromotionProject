import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthResponceData } from '../model/auth-responce.model';
import { UserCredentials } from '../model/credentials.model';
import { User } from '../model/user.model';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getAuth, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, UserCredential } from "firebase/auth";



@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user = new BehaviorSubject<User | null>(null);
    private tokenExpirationTimer: ReturnType<typeof setTimeout> | null  = null;

    constructor(private http: HttpClient, private router: Router) {
        initializeApp(environment.firebaseConfig);
    }

    signup(userCredentials: UserCredentials) {
        return this.http.post<AuthResponceData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDuHtkGcExkY3z5dyzjk0m8QJAqPjH7WZQ',
            userCredentials).pipe(
                tap((resData: AuthResponceData) => {
                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                })
            );
    }

    login(userCredentials: UserCredentials) {
        return this.http.post<AuthResponceData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDuHtkGcExkY3z5dyzjk0m8QJAqPjH7WZQ',
            userCredentials).pipe(
                tap((resData: AuthResponceData) => {
                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                })
            );
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

        } = JSON.parse(userData);

        const newLoadedUser = new User(
            parsedUser.email,
            parsedUser.id,
            parsedUser._token,
            new Date(parsedUser._tokenExpirationDate)
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
        this.router.navigate(['/auth/login']);
        localStorage.removeItem('userData');

        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        } , expirationDuration)
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);

        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    facebookAuth() {
        const provider = new FacebookAuthProvider();
        this.authenticateWithPopup(provider);
    }

    googleAuth() {
        const provider = new GoogleAuthProvider();
        this.authenticateWithPopup(provider);
    }

    private authenticateWithPopup(provider: GoogleAuthProvider | FacebookAuthProvider) {
        const auth = getAuth();

        signInWithPopup(auth, provider)
            .then((resData: any | UserCredential) => {
                this.handleAuthentication(
                    resData._tokenResponse.email,
                    resData._tokenResponse.localId,
                    resData._tokenResponse.idToken,
                    +resData._tokenResponse.expiresIn
                );
            }).catch((error) => {
                console.error('error');
            });
    }
}
