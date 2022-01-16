import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends ClearObservable implements OnInit {
    public resetPassForm!: FormGroup;
    public error: string = "";
    public loading: boolean = false;

    constructor(public formBuilder: FormBuilder, private auth: AuthService, private router: Router) {
        super();
     }

    ngOnInit(): void {
        this.resetPassForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    public onSubmitForm(): void {
        this.error = "";

        if (this.resetPassForm.valid) {
            this.loading = true;

            this.auth.resetPassword(this.resetPassForm.controls['email'].value)
                .pipe(
                    takeUntil(this.destroy$)
                )
                .subscribe({
                    next: () => this.router.navigate(['/auth/login']),
                    error: (error) => {
                        this.error = error.error.error.message;
                        this.loading = false;
                    }
                })
        }
    }
}
