import { Injectable } from "@angular/core";
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithPopup,
    FacebookAuthProvider,
    GoogleAuthProvider,
    UserCredential,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    Auth,
    AuthProvider
   } from "firebase/auth";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class FirebaseFunctions {

    constructor() {
        initializeApp(environment.firebaseConfig);
    }

    public getAuth(): Auth {
        return getAuth();
    }

    public signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential> {
        return signInWithEmailAndPassword(auth, email, password);
    }

    public createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential> {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    public signInWithPopup(auth: Auth, provider: AuthProvider): Promise<UserCredential> {
        return signInWithPopup(auth, provider);
    }

    public sendPasswordResetEmail(auth: Auth, email: string): Promise<void> {
        return sendPasswordResetEmail(auth, email);
    }

    public signOut(auth: Auth) {
        return signOut(auth);
    }

    public getFacebookProvider(): FacebookAuthProvider {
        return new FacebookAuthProvider();
    }

    public getGoogleProvider(): GoogleAuthProvider {
        return new GoogleAuthProvider();
    }
}
