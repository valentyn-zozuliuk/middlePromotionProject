import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
    selector: 'app-edit-password',
    templateUrl: './edit-password.component.html',
    styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnInit {

    editPasswordForm!: FormGroup;
    constructor(private formBuilder: FormBuilder) {

    }

    ngOnInit(): void {
        this.editPasswordForm = this.formBuilder.group({
            oldPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmNewPassword: ['', [Validators.required]],
        },  { validator: this.checkPasswords } as AbstractControlOptions);
    }

    checkPasswords(group: FormGroup): ValidationErrors | null {
        let pass = group.controls['newPassword'].value;
        let confirmPass = group.controls['confirmNewPassword'].value;

        if (pass !== confirmPass) {
            group.controls['confirmNewPassword'].setErrors({ NoPassswordMatch: true });
            return { NoPassswordMatch: true };
        }

        return null;
    }

    onSubmitForm() {

    }
}
