import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesService } from 'src/app/global-services/messages.service';
import { City, Country } from 'src/app/model/weather-info.model';

import { WeatherComponent } from './weather.component';
import { WeatherService } from './weather.service';

describe('WeatherComponent', () => {
    let component: WeatherComponent;
    let fixture: ComponentFixture<WeatherComponent>;
    let messages: jasmine.SpyObj<MessagesService>;
    let weatherService: jasmine.SpyObj<WeatherService>;

    beforeEach(async () => {
        const messagesSpy = jasmine.createSpyObj('MessagesService', ['clearMessages']);
        const weatherServiceSpy = jasmine.createSpyObj('WeatherService', ['getWeatherInfo']);
        await TestBed.configureTestingModule({
            declarations: [WeatherComponent],
            imports: [HttpClientModule],
            providers: [{
                provide: MessagesService,
                useValue: messagesSpy
            }, {
                provide: WeatherService,
                useValue: weatherServiceSpy
            }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WeatherComponent);
        component = fixture.componentInstance;
        messages = TestBed.inject(MessagesService) as jasmine.SpyObj<MessagesService>;
        weatherService = TestBed.inject(WeatherService) as jasmine.SpyObj<WeatherService>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should select Lviv as default weather location during onInit', () => {
        component.ngOnInit();

        expect(component.weatherCities[0].name).toBe(City.LVIV);
        expect(component.weatherCities[0].selected).toBeTruthy();
    });

    it('should clear error messages during onInit', () => {
        component.ngOnInit();

        expect(messages.clearMessages).toHaveBeenCalled();
    });

    it('should select city and get weather info for that city', () => {
        const weatherCity = {
            name: City.IF,
            code: 'UA',
            displayCode: 'Ua',
            selected: false
        };
        component.ngOnInit();
        component.selectItem(weatherCity, new Event('click'), 2);

        expect(component.weatherCities[2].selected).toBeTruthy();
        expect(weatherService.getWeatherInfo).toHaveBeenCalledWith(City.IF, 'UA');
    });

    it('should select modify country text', () => {
        const res = component.getCountryText(Country.UA);
        expect(res).toBe('Ua');
    });
});
