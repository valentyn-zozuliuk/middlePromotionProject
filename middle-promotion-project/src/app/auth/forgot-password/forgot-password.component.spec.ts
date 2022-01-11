import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';

import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', {
            resetPassword: of(true)
        })
        await TestBed.configureTestingModule({
            declarations: [ForgotPasswordComponent],
            imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule.withRoutes([
                { path: 'auth/login', redirectTo: '/auth/login'}
            ])],
            providers: [{
                provide: AuthService,
                useValue: authServiceSpy
            }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('forgot password form is valid if object is valid', () => {
        component.resetPassForm.patchValue({
            email: 'email@test.com',
        });

        fixture.detectChanges();

        expect(component.resetPassForm.valid).toBeTruthy();
    });

    it('forgot password form is invalid when email is missing', () => {
        component.resetPassForm.patchValue({
            email: null
        });

        fixture.detectChanges();

        expect(component.resetPassForm.valid).toBeFalsy();
    });

    it('profile form is invalid when email is wrong format', () => {
        component.resetPassForm.patchValue({
            email: 'email'
        });

        fixture.detectChanges();

        expect(component.resetPassForm.valid).toBeFalsy();
    });

    it('profile form successfully calls the auth service "resetPassword" function if the form is valid', () => {
        component.resetPassForm.patchValue({
            email: 'test.email.expected@test.com'
        });

        component.onSubmitForm();

        fixture.detectChanges();

        expect(component.resetPassForm.valid).toBeTruthy();
        expect(authService.resetPassword).toHaveBeenCalledTimes(1);
    });
});
