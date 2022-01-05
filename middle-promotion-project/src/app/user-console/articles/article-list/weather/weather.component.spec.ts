import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherComponent } from './weather.component';

describe('WeatherComponent', () => {
    let component: WeatherComponent;
    let fixture: ComponentFixture<WeatherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WeatherComponent],
            imports: [HttpClientModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WeatherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
