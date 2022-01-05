import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

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
});
