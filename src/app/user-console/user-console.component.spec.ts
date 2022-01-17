import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth/auth.service';
import { UserProfile } from '../model/user.model';

import { UserConsoleComponent } from './user-console.component';

describe('UserConsoleComponent', () => {
    let component: UserConsoleComponent;
    let fixture: ComponentFixture<UserConsoleComponent>;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserConsoleComponent],
            imports: [HttpClientModule, RouterTestingModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserConsoleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should check if it is dashboard page upon initialization', () => {
        const router = TestBed.inject(Router);
        spyOnProperty(router, 'url').and.returnValue('/user-console/articles');

        component.ngOnInit();

        expect(component.routerDashboard).toBeTruthy();
    });

    it(`should get the latest user`, () => {
        const user: UserProfile = new UserProfile('test@test.com', 'localId', 'idToken', new Date(),
            'name', 'image', 24, true);
        const authService = TestBed.inject(AuthService);
        authService.user.next(user);

        component.ngOnInit();

        expect(component.userInfo).toBeTruthy();
    });
});
