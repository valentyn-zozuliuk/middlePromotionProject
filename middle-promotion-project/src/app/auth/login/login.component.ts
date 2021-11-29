import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCredential } from '@firebase/auth';
import { takeUntil } from 'rxjs';
import { AuthResponceData } from 'src/app/model/auth-responce.model';
import { UserCredentials } from 'src/app/model/credentials.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends ClearObservable implements OnInit {
    public authForm!: FormGroup;
    public error: string = "";
    public loading: boolean = false;

    constructor(public formBuilder: FormBuilder, private auth: AuthService, private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.authForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    public onSubmitForm(): void {
        this.error = "";

        if (this.authForm.valid) {
            const userCredentials: UserCredentials = {
                email: this.authForm.controls['email'].value,
                password: this.authForm.controls['password'].value,
                returnSecureToken: true
            }

            this.loginUser(userCredentials);
        }
    }

    private loginUser(userCredentials: UserCredentials): void {
        this.loading = true;
        this.auth.login(userCredentials)
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (response: AuthResponceData) => {
                    this.loading = false;
                },
                error: error => {
                    this.error = error.error.error.message;
                    this.loading = false;
                }
            });
    }

    public googleLogin() {
        this.auth.googleAuth()
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (resData: any | UserCredential) => {
                    this.router.navigate(['/auth/login']);
                },
                error: error => {
                    this.error = error.error.error.message;
                    this.loading = false;
                }
            });
    }

    public facebookLogin() {
        this.auth.facebookAuth()
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (resData: any | UserCredential) => {
                    this.router.navigate(['/auth/login']);
                },
                error: error => {
                    this.error = error.error.error.message;
                    this.loading = false;
                }
            });
    }
}
