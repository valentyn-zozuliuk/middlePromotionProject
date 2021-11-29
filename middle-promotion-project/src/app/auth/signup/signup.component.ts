import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthResponceData } from 'src/app/model/auth-responce.model';
import { UserCredentials } from 'src/app/model/credentials.model';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    public profileForm!: FormGroup;
    public error: string = "";
    public loading: boolean = false;

    constructor(public formBuilder: FormBuilder, private auth: AuthService, public router: Router) { }

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
            const userCredentials: UserCredentials = {
                email: this.profileForm.controls['email'].value,
                password: this.profileForm.controls['password'].value,
                returnSecureToken: true
            }

            this.signupUser(userCredentials);
        } else {
            console.log(this.profileForm);
        }
    }

    get registerFormControl() {
        return this.profileForm.controls;
    }

    checkPasswords(group: FormGroup): ValidationErrors | null {
        let pass = group.controls['password'].value;
        let confirmPass = group.controls['passwordConfirm'].value;

        if (pass !== confirmPass) {
            group.controls['passwordConfirm'].setErrors({ NoPassswordMatch: true });
            return { NoPassswordMatch: true };
        }

        return null;
    }

    private signupUser(userCredentials: UserCredentials): void {
        this.loading = true;
        this.auth.signup(userCredentials)
            .subscribe({
                next: (response: AuthResponceData) => {
                    this.loading = false;
                    this.router.navigate(['/auth/login']);
                },
                error: error => {
                    this.error = error.error.error.message;
                    this.loading = false;
                }
            });
    }

    public googleSignup() {
        this.auth.googleAuth();
    }

    public facebookSignup() {
        this.auth.facebookAuth();
    }
}
