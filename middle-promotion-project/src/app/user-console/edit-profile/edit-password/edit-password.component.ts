import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UpdatePasswordData } from 'src/app/model/user-edit.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
    selector: 'app-edit-password',
    templateUrl: './edit-password.component.html',
    styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent extends ClearObservable implements OnInit {
    @Input() formSubmitEmitter!: EventEmitter<void>;
    @Output() submitInfo = new EventEmitter<UpdatePasswordData>();
    @ViewChild('submitBtn', {static: true}) submitBtn!: ElementRef;

    public editPasswordForm!: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.editPasswordForm = this.formBuilder.group({
            oldPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmNewPassword: ['', [Validators.required]],
        },  { validator: this.checkPasswords } as AbstractControlOptions);

        if (!!this.formSubmitEmitter) {
            this.formSubmitEmitter
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => this.submitBtn.nativeElement.click());
        }
    }

    private checkPasswords(group: FormGroup): ValidationErrors | null {
        let pass = group.controls['newPassword'].value;
        let confirmPass = group.controls['confirmNewPassword'].value;

        if (pass !== confirmPass) {
            group.controls['confirmNewPassword'].setErrors({ NoPassswordMatch: true });
            return { NoPassswordMatch: true };
        }

        return null;
    }

    public onSubmitForm(): void {
        if (this.editPasswordForm.valid) {
            this.submitInfo.emit({
                oldPassword: this.editPasswordForm.controls['oldPassword'].value,
                newPassword: this.editPasswordForm.controls['newPassword'].value,
                confirmNewPassword: this.editPasswordForm.controls['confirmNewPassword'].value
            });
        }
    }
}
