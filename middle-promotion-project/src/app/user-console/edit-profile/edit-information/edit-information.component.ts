import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-edit-information',
    templateUrl: './edit-information.component.html',
    styleUrls: ['./edit-information.component.scss']
})


export class EditInformationComponent implements OnInit {
    @Output() submitInfo = new EventEmitter<any>()
    editInformationForm!: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.editInformationForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            age: [null, [Validators.required]]
        });
    }

    onSubmitForm() {

    }

}
