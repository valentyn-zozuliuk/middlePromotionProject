import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateInformationData } from '../model/user-edit.model';
import { UserAdditionalInfo } from '../model/user.model';
import { UserDetailsService } from './user-details.service';

describe('UserDetailsService', () => {
    let service: UserDetailsService,
        httpTestingController: HttpTestingController,
        returnObservableData: UserAdditionalInfo

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule, HttpClientModule]
        });

        service = TestBed.inject(UserDetailsService);
        httpTestingController = TestBed.inject(HttpTestingController);
        returnObservableData = {
            information: {
                name: 'Val Zoz',
                age: 24
            },
            avatar: {
                src: 'src'
            },
            isDefaultUser: true
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('saveUserDetails saves information', () => {
        const input = {
            data: returnObservableData,
            uid: '12345'
        };

        service.saveUserDetails(input.uid, returnObservableData)
            .subscribe((res) => {
                expect(res).toBeTruthy();
                expect(res).toEqual(returnObservableData);
            });


        const req = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${input.uid}.json`
        );

        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual(input.data);


        req.flush(returnObservableData);
    });

    it('fetchUser should fetch user details information', () => {
        const input = {
            data: returnObservableData,
            uid: '12345'
        };

        service.fetchUser(input.uid)
            .subscribe((res) => {
                expect(res).toBeTruthy();
                expect(res).toEqual(returnObservableData);
            });


        const req = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${input.uid}.json`
        );

        expect(req.request.method).toEqual("GET");

        req.flush(returnObservableData);
    });

    it('update user info should work correctly', () => {
        const data: UpdateInformationData = {
            firstName: 'Val',
            lastName: 'Zoz',
            age: 24
        };

        const input = {
            data: data,
            uid: '12345'
        };

        service.updateUserInfo(input.data, input.uid)
            .subscribe((res) => {
                expect(res).toBeTruthy();
                expect(res).toEqual(returnObservableData);
            });


        const req = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${input.uid}/information.json`
        );

        expect(req.request.method).toEqual("PUT");
        expect(req.request.body.age).toEqual(input.data.age);
        expect(req.request.body.name).toEqual(input.data.firstName + ' ' + input.data.lastName);

        req.flush(returnObservableData);
    });

    it('update user avatar should work correctly', () => {
        const input = {
            avatar: 'avatar',
            uid: '12345'
        };

        service.updateAvatar(input.avatar, input.uid)
            .subscribe((res) => {
                expect(res).toBeTruthy();
                expect(res.information.age).toBe(24);
            });


        const req = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${input.uid}/avatar.json`
        );

        expect(req.request.method).toEqual("PUT");
        expect(req.request.body.src).toEqual(input.avatar);

        req.flush(returnObservableData);
    });

    it('update user type should work correctly', () => {
        const input = {
            avatar: 'avatar',
            uid: '12345'
        };

        service.updateUserType(true, input.uid)
            .subscribe((res) => {
                expect(res).toBeTrue();
            });


        const req = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${input.uid}/isDefaultUser.json`
        );

        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual(true);

        req.flush(true);
    });
});
