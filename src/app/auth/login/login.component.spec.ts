import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', {
            login: of(true),
            googleAuth: of(true),
            facebookAuth: of(true)
        });

        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [ReactiveFormsModule, RouterTestingModule, HttpClientModule],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceSpy
                }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

        //@ts-ignore
        spyOn(component.router, 'navigate').and.returnValue(Promise.resolve(true));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('auth form is valid if object is valid', () => {
        component.authForm.patchValue({
            email: 'email@test.com',
            password: '11111111'
        });

        fixture.detectChanges();

        expect(component.authForm.valid).toBeTruthy();
    });

    it('auth form is invalid when email is missing', () => {
        component.authForm.patchValue({
            password: '11111111'
        });

        fixture.detectChanges();

        expect(component.authForm.valid).toBeFalsy();
    });

    it('auth form is invalid when email is wrong format', () => {
        component.authForm.patchValue({
            email: 'email',
            password: '11111111'
        });

        fixture.detectChanges();

        expect(component.authForm.valid).toBeFalsy();
    });

    it('auth form is invalid when password is missing', () => {
        component.authForm.patchValue({
            email: 'email',
            password: ''
        });

        fixture.detectChanges();

        expect(component.authForm.valid).toBeFalsy();
    });

    it('auth form successfully calls the auth service "login" function if the form is valid', () => {
        component.authForm.patchValue({
            email: 'test.email.expected@test.com',
            password: 'Qwerty'
        });

        component.onSubmitForm();

        fixture.detectChanges();

        expect(component.authForm.valid).toBeTruthy();
        expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('auth form do not call the auth service "login" function if the form is invalid', () => {
        component.authForm.patchValue({
            email: 'test',
            password: 'Qwerty'
        });

        component.onSubmitForm();

        fixture.detectChanges();

        expect(component.authForm.valid).toBeFalsy();
        expect(authService.login).toHaveBeenCalledTimes(0);
    });

    it('google signup functionality performs Google Authentication', () => {
        component.googleLogin();

        fixture.detectChanges();

        expect(authService.googleAuth).toHaveBeenCalledTimes(1);
    });

    it('facebook signup functionality performs Facebook Authentication', () => {
        component.facebookLogin();

        fixture.detectChanges();

        expect(authService.facebookAuth).toHaveBeenCalledTimes(1);
    });

    it('error handling works', () => {
        component.authForm.patchValue({
            email: 'test@test.com',
            password: 'Qwerty'
        });

        authService.login.and.returnValue(throwError(() => new Error('Test error')));

        component.onSubmitForm();

        fixture.detectChanges();

        expect(component.authForm.valid).toBeTruthy();
        expect(authService.login).toHaveBeenCalledTimes(1);
        expect(component.error).toBe('Test error');
    });
});
