import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MenuHeaderComponent } from './menu-header.component';

describe('MenuHeaderComponent', () => {
    let component: MenuHeaderComponent;
    let fixture: ComponentFixture<MenuHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MenuHeaderComponent],
            imports: [RouterTestingModule, HttpClientModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
