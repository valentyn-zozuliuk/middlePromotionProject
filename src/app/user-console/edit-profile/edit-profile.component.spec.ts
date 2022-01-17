import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserDetailsService } from 'src/app/auth/user-details.service';
import { MessagesService } from 'src/app/global-services/messages.service';
import { ArticlesService } from '../articles/articles.service';

import { EditProfileComponent } from './edit-profile.component';

describe('EditProfileComponent', () => {
    let component: EditProfileComponent;
    let fixture: ComponentFixture<EditProfileComponent>;
    let messages: jasmine.SpyObj<MessagesService>;
    let authService: jasmine.SpyObj<AuthService>;
    let userDetailsService: jasmine.SpyObj<UserDetailsService>;
    let articlesService: jasmine.SpyObj<ArticlesService>;

    beforeEach(async () => {
        const messagesSpy = jasmine.createSpyObj('MessagesService', ['clearMessages', 'showErrors']);
        const userDtailsServiceSpy = jasmine.createSpyObj('UserDetailsService', ['updateUserInfo',
            'updateAvatar']);
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['updateUserProfile', 'login',
            'reauthenticateUser', 'changePassword'], {
                user: of(true)
            });

        const articlesServiceSpy = jasmine.createSpyObj('AuthService', ['updateAuthorsArticles']);

        await TestBed.configureTestingModule({
            declarations: [EditProfileComponent],
            imports: [RouterTestingModule, HttpClientModule],
            providers: [{
                provide: MessagesService,
                useValue: messagesSpy
            }, {
                provide: AuthService,
                useValue: authServiceSpy
            }, {
                provide: UserDetailsService,
                useValue: userDtailsServiceSpy
            }, {
                provide: ArticlesService,
                useValue: articlesServiceSpy
            }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditProfileComponent);
        component = fixture.componentInstance;
        messages = TestBed.inject(MessagesService) as jasmine.SpyObj<MessagesService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        userDetailsService = TestBed.inject(UserDetailsService) as jasmine.SpyObj<UserDetailsService>;
        articlesService = TestBed.inject(ArticlesService) as jasmine.SpyObj<ArticlesService>;

        //@ts-ignore
        spyOn(component.router, 'navigate').and.returnValue(Promise.resolve(true));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should clear error messages and subscribe to message observable during initializtion', () => {
        messages.errors$ = of([]);
        component.ngOnInit();
        expect(messages.clearMessages).toHaveBeenCalled();
        expect(component.errors$).toBeTruthy();
    });

    it('should have the app-edit-avatar component displayed upon change to second tab and hide other', fakeAsync(() => {
        const a = {
            index: 1
        };

        //@ts-ignore
        component.changeTab(a);
        flush();
        fixture.detectChanges();

        expect(messages.clearMessages).toHaveBeenCalled();
        expect(fixture.debugElement.query(By.css('app-edit-information'))).toBeFalsy();
        expect(fixture.debugElement.query(By.css('app-edit-avatar'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('app-edit-password'))).toBeFalsy();
        expect(component.tabIndex).toBe(1);
    }));

    it('calls the event emitter during the form submit', () => {
        spyOn(component.userEditSubmitEmitter, 'emit');

        component.submitForm();

        expect(component.userEditSubmitEmitter.emit).toHaveBeenCalled();
    });

    it('calls the `updateUserInfo` during the `submitInfo` event by default', () => {
        const innerComponent = fixture.debugElement.query(By.css('app-edit-information'));
        innerComponent.triggerEventHandler('submitInfo', {
            firstName: 'Val',
            lastName: 'Zoz',
            age: 15
        });

        expect(userDetailsService.updateUserInfo).toHaveBeenCalledTimes(1);
    });

    it('calls the `updateUserProfile` with correct arguments and updates articles during the `submitInfo` event by default', () => {
        //@ts-ignore
        userDetailsService.updateUserInfo.and.returnValue(of(true));

        const innerComponent = fixture.debugElement.query(By.css('app-edit-information'));
        innerComponent.triggerEventHandler('submitInfo', {
            firstName: 'Val',
            lastName: 'Zoz',
            age: 15
        });

        expect(authService.updateUserProfile).toHaveBeenCalledWith('Val Zoz', 15);
        expect(articlesService.updateAuthorsArticles).toHaveBeenCalled();
    });

    it('calls the `updateUserInfo` during the `avatarUpdate` event', fakeAsync(() => {
        const a = {
            index: 1
        };

        //@ts-ignore
        component.changeTab(a);
        flush();
        fixture.detectChanges();
        const innerComponent = fixture.debugElement.query(By.css('app-edit-avatar'));
        innerComponent.triggerEventHandler('avatarUpdate', 'src');

        expect(userDetailsService.updateAvatar).toHaveBeenCalledTimes(1);
    }));

    it('calls the `updateUserProfile` with correct arguments and updates articles during the `avatarUpdate` event', fakeAsync(() => {
        const a = {
            index: 1
        };

        //@ts-ignore
        userDetailsService.updateAvatar.and.returnValue(of(true));

        //@ts-ignore
        component.changeTab(a);
        flush();
        fixture.detectChanges();
        const innerComponent = fixture.debugElement.query(By.css('app-edit-avatar'));
        innerComponent.triggerEventHandler('avatarUpdate', 'src');

        expect(authService.updateUserProfile).toHaveBeenCalledWith("", 0, 'src');
        expect(articlesService.updateAuthorsArticles).toHaveBeenCalled();
    }));

    it('should be able to swith to `Change password` if user is default', fakeAsync(() => {

        const a = {
            index: 2
        };

        //@ts-ignore
        component.userInfo = {
            email: 'test@test.com',
            isDefaultUser: true
        };
        //@ts-ignore
        component.changeTab(a);
        flush();
        fixture.detectChanges();
        const innerComponent = fixture.debugElement.query(By.css('app-edit-password'));

        expect(innerComponent).toBeTruthy();
    }));

    it('changing password algorithm works correctly', fakeAsync(() => {
        const a = {
            index: 2
        };

        const passwordData = {
            oldPassword: '11111111',
            newPassword: '22222222',
            confirmNewPassword: '22222222'
        };

        //@ts-ignore
        authService.reauthenticateUser.and.returnValue(of(true));
        //@ts-ignore
        authService.login.and.returnValue(of(true));
        //@ts-ignore
        authService.changePassword.and.returnValue(of(true));

        //@ts-ignore
        component.userInfo = {
            email: 'test@test.com',
            isDefaultUser: true,
            token: 'token'
        };

        //@ts-ignore
        component.changeTab(a);
        flush();
        fixture.detectChanges();
        const innerComponent = fixture.debugElement.query(By.css('app-edit-password'));
        innerComponent.triggerEventHandler('submitInfo', passwordData);

        expect(authService.reauthenticateUser).toHaveBeenCalledWith(passwordData,
        //@ts-ignore
        component.userInfo?.email);
        //@ts-ignore
        expect(authService.changePassword).toHaveBeenCalledWith(component.userInfo?.token,
            passwordData.confirmNewPassword);
        expect(authService.login).toHaveBeenCalled();
    }));

    it('changing password algorithm processes errors correctly', fakeAsync(() => {
        const a = {
            index: 2
        };

        const passwordData = {
            oldPassword: '11111111',
            newPassword: '22222222',
            confirmNewPassword: '22222222'
        };

        //@ts-ignore
        component.userInfo = {
            email: 'test@test.com',
            isDefaultUser: true,
            token: 'token'
        };

        const error = {
            error: {
                error: {
                    message: 'INVALID_PASSWORD'
                }
            }
        };

        //@ts-ignore
        authService.reauthenticateUser.and.returnValue(of(true));
        //@ts-ignore
        authService.changePassword.and.returnValue(of(true));
        authService.login.and.returnValue(throwError(() => error));

        //@ts-ignore
        component.changeTab(a);
        flush();
        fixture.detectChanges();
        const innerComponent = fixture.debugElement.query(By.css('app-edit-password'));
        innerComponent.triggerEventHandler('submitInfo', passwordData);

        expect(messages.showErrors).toHaveBeenCalledWith('Invalid old password.');

    }));
});
