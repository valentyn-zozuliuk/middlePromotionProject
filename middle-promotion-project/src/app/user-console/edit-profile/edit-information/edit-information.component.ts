import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UpdateInformationData } from 'src/app/model/user-edit.model';
import { UserProfile } from 'src/app/model/user.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
    selector: 'app-edit-information',
    templateUrl: './edit-information.component.html',
    styleUrls: ['./edit-information.component.scss']
})


export class EditInformationComponent extends ClearObservable implements OnInit, OnChanges {
    @Input() formSubmitEmitter!: EventEmitter<void>;
    @Input() userInfo!: UserProfile | null;

    @Output() submitInfo = new EventEmitter<UpdateInformationData>();
    @ViewChild('submitBtn', {static: true}) submitBtn!: ElementRef;

    editInformationForm!: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        super();
        this.editInformationForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            age: [null, [Validators.required]]
        });
    }

    ngOnChanges(): void {
        if (this.userInfo) {
            this.editInformationForm.patchValue({
                firstName: this.userInfo.name.split(' ')[0],
                lastName: this.getNameSecondPart(),
                age: this.userInfo.age
            });
        }
    }

    getNameSecondPart() {
        const arrName = this.userInfo?.name.split(' ');

        if (arrName && arrName?.length > 2) {
            let lastName = arrName.reduce((prev, curr, index) => {
                if (index > 0) {
                    return prev.length > 0 ?
                        prev + ' ' + curr : curr;
                }

                return '';
            } ,'');

            return lastName;
        }

        return arrName ? arrName[1] : '';
    }

    ngOnInit(): void {
        if (!!this.formSubmitEmitter) {
            this.formSubmitEmitter
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => this.submitBtn.nativeElement.click());
        }
    }

    onSubmitForm() {
        if (this.editInformationForm.valid) {
            this.submitInfo.emit({
                firstName: this.editInformationForm.controls['firstName'].value,
                lastName: this.editInformationForm.controls['lastName'].value,
                age: this.editInformationForm.controls['age'].value
            });
        }
    }

}
