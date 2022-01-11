import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateInformationData } from '../model/user-edit.model';
import { UserAdditionalInfo, UserProfile } from '../model/user.model';
import { UserDetailsService } from './user-details.service';

fdescribe('UserDetailsService', () => {
    let service: UserDetailsService,
        httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule, HttpClientModule]
        });

        service = TestBed.inject(UserDetailsService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('update user info should work correctly', () => {
        const returnObservableData: UserAdditionalInfo = {
            information: {
                name: 'Val Zoz',
                age: 24
            },
            avatar: {
                src: 'src'
            },
            isDefaultUser: true
        };

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
                expect(res.isDefaultUser).toBeTruthy();
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
        const returnObservableData: UserAdditionalInfo = {
            information: {
                name: 'test name',
                age: 14
            },
            avatar: {
                src: 'avatar'
            },
            isDefaultUser: true
        };

        const input = {
            avatar: 'avatar',
            uid: '12345'
        };

        service.updateAvatar(input.avatar, input.uid)
            .subscribe((res) => {
                expect(res).toBeTruthy();
                expect(res.information.age).toBe(14);
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
                expect(res).toBeTruthy();
            });


        const req = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${input.uid}/isDefaultUser.json`
        );

        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual(true);

        req.flush(true);
    });
});
