import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UpdateInformationData } from 'src/app/model/user-edit.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
    selector: 'app-edit-information',
    templateUrl: './edit-information.component.html',
    styleUrls: ['./edit-information.component.scss']
})


export class EditInformationComponent extends ClearObservable implements OnInit {
    @Input() formSubmitEmitter!: EventEmitter<void>;
    @Output() submitInfo = new EventEmitter<UpdateInformationData>();
    @ViewChild('submitBtn', {static: true}) submitBtn!: ElementRef;

    editInformationForm!: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.editInformationForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            age: [null, [Validators.required]]
        });

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
