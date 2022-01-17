import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ChangePasswordReturnData, ReauthenticateReturnData } from '../model/user-edit.model';
import { UserAdditionalInfo, UserProfile } from '../model/user.model';
import { AuthService } from './auth.service';
import { FirebaseFunctions } from './firebase-functions.service';
import { UserDetailsService } from './user-details.service';

describe('AuthService', () => {
    let service: AuthService,
        httpTestingController: HttpTestingController,
        firebaseFunctions: jasmine.SpyObj<FirebaseFunctions>,
        userDetailsService: jasmine.SpyObj<UserDetailsService>,
        userAdditionalInfo: UserAdditionalInfo,
        localStore: {[key: string]: string},
        userCredentials:  {
            _tokenResponse: {
                email: string,
                localId: string,
                idToken: string,
                expiresIn: number,
                displayName: string,
                photoURL: string,
                isNewUser?: boolean
            },
            user: {
                photoURL: string;
            }
        };

    beforeEach(() => {
        const firebaseFunctionsSpy = jasmine
            .createSpyObj('FirebaseFunctions', ['signInWithEmailAndPassword', 'createUserWithEmailAndPassword',
                'getAuth', 'signOut', 'signInWithPopup', 'getFacebookProvider', 'getGoogleProvider']);

        const userDetailsServiceSpy = jasmine
            .createSpyObj('UserDetailsService', ['fetchUserDetails', 'saveUserDetails']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule, HttpClientModule],
            providers: [{
                provide: FirebaseFunctions,
                useValue: firebaseFunctionsSpy
            }, {
                provide: UserDetailsService,
                useValue: userDetailsServiceSpy
            }]
        });

        service = TestBed.inject(AuthService);
        httpTestingController = TestBed.inject(HttpTestingController);
        firebaseFunctions = TestBed.inject(FirebaseFunctions) as jasmine.SpyObj<FirebaseFunctions>;
        userDetailsService = TestBed.inject(UserDetailsService) as jasmine.SpyObj<UserDetailsService>;

        userCredentials = {
            _tokenResponse: {
                email: 'test.email@email.com',
                localId: '123',
                idToken: '123',
                expiresIn: 2222222222,
                displayName: 'Name Test',
                photoURL: 'src',
                isNewUser: false
            },
            user: {
                photoURL: 'src'
            }
        };

        userAdditionalInfo = {
            information: {
                name: 'Val Zoz',
                age: 24
            },
            avatar: {
                src: 'src'
            },
            isDefaultUser: true
        };

        //@ts-ignore
        spyOn(service.router, 'navigate').and.returnValue(Promise.resolve(true));

        localStore = {};

        spyOn(window.localStorage, 'getItem').and.callFake((key) =>
            key in localStore ? localStore[key] : null
        );
        spyOn(window.localStorage, 'setItem').and.callFake(
            (key, value) => (localStore[key] = value + '')
        );
        spyOn(window.localStorage, 'removeItem').and.callFake(
            (key) => delete localStore[key]
        );
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('login should create user profile, user observable and fetch user latest details', (done: DoneFn) => {
        //@ts-ignore
        firebaseFunctions.signInWithEmailAndPassword.and.returnValue(Promise.resolve(userCredentials));
        userDetailsService.fetchUserDetails.and.returnValue(of(userAdditionalInfo));

        service.login({ email: userCredentials._tokenResponse.email, password: '12333', returnSecureToken: false})
            .subscribe(() => {
                expect(localStorage.getItem('userData')).toBeTruthy();
                expect(userDetailsService.fetchUserDetails).toHaveBeenCalledTimes(1);
                service.user.subscribe(userPr => {
                    expect(userPr).toBeTruthy();
                    done();
                });
            });
    });

    it('signup should create user profile, user observable and save user details', (done: DoneFn) => {
        //@ts-ignore
        firebaseFunctions.createUserWithEmailAndPassword.and.returnValue(Promise.resolve(userCredentials));
        userDetailsService.saveUserDetails.and.returnValue(of(userAdditionalInfo));

        service.signup({ email: userCredentials._tokenResponse.email, password: '12333', returnSecureToken: false,
                        name: userAdditionalInfo.information.name, age: 24})
            .subscribe(() => {
                expect(localStorage.getItem('userData')).toBeTruthy();
                expect(userDetailsService.saveUserDetails).toHaveBeenCalledTimes(1);
                service.user.subscribe(userPr => {
                    expect(userPr).toBeTruthy();
                    done();
                });
            });
    });

    it('facebook auth should create user profile, user observable and save user details if new user is true', (done: DoneFn) => {
        userCredentials._tokenResponse.isNewUser = true;

        //@ts-ignore
        firebaseFunctions.signInWithPopup.and.returnValue(Promise.resolve(userCredentials));
        userDetailsService.saveUserDetails.and.returnValue(of(userAdditionalInfo));

        service.facebookAuth()
            .subscribe(() => {
                expect(localStorage.getItem('userData')).toBeTruthy();
                expect(userDetailsService.saveUserDetails).toHaveBeenCalledTimes(1);
                service.user.subscribe(userPr => {
                    expect(userPr).toBeTruthy();
                    done();
                });
            });
    });

    it('google auth should create user profile, user observable and fetch user details if new user is false', (done: DoneFn) => {
        userCredentials._tokenResponse.isNewUser = false;

        //@ts-ignore
        firebaseFunctions.signInWithPopup.and.returnValue(Promise.resolve(userCredentials));
        userDetailsService.fetchUserDetails.and.returnValue(of(userAdditionalInfo));

        service.googleAuth()
            .subscribe(() => {
                expect(localStorage.getItem('userData')).toBeTruthy();
                expect(userDetailsService.fetchUserDetails).toHaveBeenCalledTimes(1);
                service.user.subscribe(userPr => {
                    expect(userPr).toBeTruthy();
                    done();
                });
            });
    });

    it('reauthentication should work correctly', () => {
        const returnObservableData: ReauthenticateReturnData = {
            idToken: 'token',
            email: 'email.test@test.com',
            refreshToken: 'refreshToken',
            expiresIn: '12345678',
            localId: 'localId',
            registered: true
        };

        const passwordInput = {
            oldPassword: '1111',
            newPassword: '2222',
            confirmNewPassword: '2222'
        };

        const emailInput = 'test@test.com';

        service.reauthenticateUser(passwordInput, emailInput)
            .subscribe((res) => {
                expect(res).toBeTruthy();
                expect(res.localId).toBe(returnObservableData.localId);
            });


        const req = httpTestingController.expectOne(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDuHtkGcExkY3z5dyzjk0m8QJAqPjH7WZQ'
        );
        expect(req.request.method).toEqual("POST");
        expect(req.request.body.email).toEqual(emailInput);
        expect(req.request.body.password).toEqual(passwordInput.oldPassword);
        expect(req.request.body.returnSecureToken).toEqual(false);

        req.flush(returnObservableData);
    });

    it('changing password should work correctly', () => {
        const returnObservableData: ChangePasswordReturnData = {
            idToken: 'token',
            email: 'email.test@test.com',
            emailVerified: true,
            kind: 'kind',
            localId: 'localId',
            passwordHash: 'passwordHash'
        };

        const input = {
            idToken: 'idToken',
            password: 'password'
        };

        service.changePassword(input.idToken, input.password)
            .subscribe((res) => {
                expect(res).toBeTruthy();
                expect(res.kind).toBe(returnObservableData.kind);
            });


        const req = httpTestingController.expectOne(
            'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDuHtkGcExkY3z5dyzjk0m8QJAqPjH7WZQ'
        );
        expect(req.request.method).toEqual("POST");
        expect(req.request.body.idToken).toEqual(input.idToken);
        expect(req.request.body.password).toEqual(input.password);

        req.flush(returnObservableData);
    });

    it('update user profile should work correctly if user has been found', () => {
        const expectedName = 'Expected name';
        const expectedAvatar = 'Expected avatar';
        const expectedAge = 12;

        const user = new UserProfile('test@test.com', 'localId', 'idToken', new Date(),
            'name', 'image', 24, true);

        localStorage.setItem('userData', JSON.stringify(user));
        service.updateUserProfile(expectedName, expectedAge, expectedAvatar);

        const latestData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
            name: string;
            age: number | null | undefined;
            image: string | undefined;
            isDefaultUser: boolean;
        } = JSON.parse(localStorage.getItem('userData') || "");

        expect(latestData.name).toBe(expectedName);
        expect(latestData.age).toBe(expectedAge);
        expect(latestData.image).toBe(expectedAvatar);

        service.user.subscribe(userPr => {
            expect(userPr).toBeTruthy();
        });
    });

    it('update user profile should not work if there is no current user', () => {
        const expectedName = 'Expected name';
        const expectedAvatar = 'Expected avatar';
        const expectedAge = 12;

        service.updateUserProfile(expectedName, expectedAge, expectedAvatar);

        expect(localStorage.getItem('userData')).toBeFalsy();
    });

    it('autologin should fetch and store current user', () => {
        const user = new UserProfile('test@test.com', 'localId', 'idToken', new Date(new Date().getTime() + 245000000),
            'name', 'image', 24, true);

        localStorage.setItem('userData', JSON.stringify(user));

        service.autoLogin();

        service.user.subscribe(userPr => {
            expect(userPr).toBeTruthy();
        });
    });

    it('autologin should not work if there is no current user', () => {
        service.autoLogin();

        expect(localStorage.getItem('userData')).toBeFalsy();
    });

    it('logout deletes user profile and clears timer', () => {
        //@ts-ignore
        service.tokenExpirationTimer = setTimeout(() => 'test');

        const user = new UserProfile('test@test.com', 'localId', 'idToken', new Date(),
            'name', 'image', 24, true);

        localStorage.setItem('userData', JSON.stringify(user));

        service.logout();

        expect(localStorage.getItem('userData')).toBeFalsy();

        //@ts-ignore
        expect(service.tokenExpirationTimer).toBeFalsy();
    });
});
