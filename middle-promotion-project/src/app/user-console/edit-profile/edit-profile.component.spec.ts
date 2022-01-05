import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EditProfileComponent } from './edit-profile.component';

describe('EditProfileComponent', () => {
    let component: EditProfileComponent;
    let fixture: ComponentFixture<EditProfileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditProfileComponent],
            imports: [RouterTestingModule, HttpClientModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
