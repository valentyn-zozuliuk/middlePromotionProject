import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { EditInformationComponent } from './edit-information.component';

describe('EditInformationComponent', () => {
    let component: EditInformationComponent;
    let fixture: ComponentFixture<EditInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditInformationComponent],
            imports: [ReactiveFormsModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
