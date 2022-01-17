import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UserAuthCredentials } from 'src/app/model/credentials.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends ClearObservable implements OnInit {

    public profileForm!: FormGroup;
    public error: string = "";
    public loading: boolean = false;

    constructor(public formBuilder: FormBuilder, private auth: AuthService, public router: Router) {
        super();
    }

    ngOnInit(): void {
        this.profileForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            age: [null, [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            passwordConfirm: ['', [Validators.required]],
            acceptTerms: [false, [Validators.requiredTrue]]
        },
            { validator: this.checkPasswords } as AbstractControlOptions
        );
    }

    public onSubmitForm(): void {
        this.error = "";

        if (this.profileForm.valid) {
            const userCredentials: UserAuthCredentials = {
                email: this.profileForm.controls['email'].value,
                password: this.profileForm.controls['password'].value,
                name: this.profileForm.controls['name'].value,
                age: this.profileForm.controls['age'].value,
                returnSecureToken: true,

            }

            this.signupUser(userCredentials);
        }
    }

    private checkPasswords(group: FormGroup): ValidationErrors | null {
        let pass = group.controls['password'].value;
        let confirmPass = group.controls['passwordConfirm'].value;

        if (pass !== confirmPass) {
            group.controls['passwordConfirm'].setErrors({ NoPassswordMatch: true });
            return { NoPassswordMatch: true };
        }

        return null;
    }

    private signupUser(userCredentials: UserAuthCredentials): void {
        this.loading = true;
        this.auth.signup(userCredentials)
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: () => {
                    this.loading = false;
                    this.router.navigate(['/auth/login']);
                },
                error: error => {
                    this.error = error.message;
                    this.loading = false;
                }
            });
    }

    public googleSignup(): void {
        this.auth.googleAuth()
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: () => {
                    this.router.navigate(['/auth/login']);
                },
                error: error => {
                    this.error = error.message;
                    this.loading = false;
                }
            });
    }

    public facebookSignup(): void {
        this.auth.facebookAuth()
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: () => {
                    this.router.navigate(['/auth/login']);
                },
                error: error => {
                    this.error = error.message;
                    this.loading = false;
                }
            });
    }
}
