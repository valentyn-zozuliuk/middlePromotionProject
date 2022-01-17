import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', {
            signup: of(true),
            googleAuth: of(true),
            facebookAuth: of(true)
        })
        await TestBed.configureTestingModule({
            declarations: [SignupComponent],
            imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceSpy
                }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        spyOn(component.router, 'navigate').and.returnValue(Promise.resolve(true));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('profile form is valid if object is valid', () => {
        component.profileForm.patchValue({
            name: 'Test Name',
            age: 12,
            email: 'email@test.com',
            password: '11111111',
            passwordConfirm: '11111111',
            acceptTerms: true
        });

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeTruthy();
    });

    it('profile form is invalid when name is missing', () => {
        component.profileForm.patchValue({
            name: null,
            age: 12,
            email: 'email@test.com',
            password: '11111111',
            passwordConfirm: '11111111',
            acceptTerms: true
        });

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeFalsy();
    });

    it('profile form is invalid when age is missing', () => {
        component.profileForm.patchValue({
            name: 'Test Name',
            age: null,
            email: 'email@test.com',
            password: '11111111',
            passwordConfirm: '11111111',
            acceptTerms: true
        });

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeFalsy();
    });

    it('profile form is invalid when email is missing', () => {
        component.profileForm.patchValue({
            name: 'Test Name',
            age: 12,
            email: null,
            password: '11111111',
            passwordConfirm: '11111111',
            acceptTerms: true
        });

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeFalsy();
    });

    it('profile form is invalid when email is wrong format', () => {
        component.profileForm.patchValue({
            name: 'Test Name',
            age: 12,
            email: 'email',
            password: '11111111',
            passwordConfirm: '11111111',
            acceptTerms: true
        });

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeFalsy();
    });

    it('profile form is invalid when password is missing', () => {
        component.profileForm.patchValue({
            name: 'Test Name',
            age: 12,
            email: 'email@test.com',
            password: null,
            passwordConfirm: '11111111',
            acceptTerms: true
        });

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeFalsy();
    });

    it('profile form is invalid when password is less than 8 digits', () => {
        component.profileForm.patchValue({
            name: 'Test Name',
            age: 12,
            email: 'email@test.com',
            password: '1111',
            passwordConfirm: '1111',
            acceptTerms: true
        });

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeFalsy();
    });

    it('profile form is invalid when password and confirm Password are different', () => {
        component.profileForm.patchValue({
            name: 'Test Name',
            age: 12,
            email: 'email@test.com',
            password: '11111111',
            passwordConfirm: '222222222',
            acceptTerms: true
        });

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeFalsy();
    });

    it('profile form is invalid when Terms are not accepted', () => {
        component.profileForm.patchValue({
            name: 'Test Name',
            age: 12,
            email: 'email@test.com',
            password: '11111111',
            passwordConfirm: '222222222',
            acceptTerms: true
        });

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeFalsy();
    });

    it('profile form successfully calls the auth service "signup" function if the form is valid', () => {
        component.profileForm.patchValue({
            name: 'Test Name',
            age: 12,
            email: 'email@test.com',
            password: '11111111',
            passwordConfirm: '11111111',
            acceptTerms: true
        });

        component.onSubmitForm();

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeTruthy();
        expect(authService.signup).toHaveBeenCalledTimes(1);
    });

    it('profile form do not call the auth service "signup" function if the form is invalid', () => {
        component.profileForm.patchValue({
            name: null,
            age: null,
            email: 'email@test.com',
            password: '11111111',
            passwordConfirm: '11111111',
            acceptTerms: true
        });

        component.onSubmitForm();

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeFalsy();
        expect(authService.signup).toHaveBeenCalledTimes(0);
    });

    it('google signup functionality performs Google Authentication', () => {
        component.googleSignup();

        fixture.detectChanges();

        expect(authService.googleAuth).toHaveBeenCalledTimes(1);
    });

    it('facebook signup functionality performs Facebook Authentication', () => {
        component.facebookSignup();

        fixture.detectChanges();

        expect(authService.facebookAuth).toHaveBeenCalledTimes(1);
    });

    it('error handling works', () => {
        component.profileForm.patchValue({
            name: 'Test Name',
            age: 12,
            email: 'email@test.com',
            password: '11111111',
            passwordConfirm: '11111111',
            acceptTerms: true
        });

        authService.signup.and.returnValue(throwError(() => new Error('Test error')));

        component.onSubmitForm();

        fixture.detectChanges();

        expect(component.profileForm.valid).toBeTruthy();
        expect(authService.signup).toHaveBeenCalledTimes(1);
        expect(component.error).toBe('Test error');
    });
});
