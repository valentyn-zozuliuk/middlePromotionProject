import { Component, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { GlobalEventsService } from 'src/app/global-services/global-events.service';
import { MessagesService } from 'src/app/global-services/messages.service';
import { City, Country, Weather } from 'src/app/model/weather-info.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { WeatherService } from './weather.service';

interface WeatherCity {
    name: City;
    code: string;
    displayCode: string;
    selected: boolean;
}

@Component({
    selector: 'app-weather',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss']
})
export class WeatherComponent extends ClearObservable implements OnInit {

    public weatherInfo$: Observable<Weather | null> | null = null;
    public errors$: Observable<string[]> | null = null;
    public showWeatherMenu: boolean = false;
    public weatherCities: WeatherCity[] = [
        { name: City.LVIV, code: 'UA', displayCode: 'Ua', selected: true },
        { name: City.KYIV, code: 'UA', displayCode: 'Ua', selected: false },
        { name: City.IF, code: 'UA', displayCode: 'Ua', selected: false },
    ];

    constructor(
        private weatherService: WeatherService,
        private messages: MessagesService,
        private globalEventsService: GlobalEventsService) {
        super();
    }

    ngOnInit(): void {
        this.messages.clearMessages();
        this.selectItem(this.weatherCities[0]);
        this.weatherInfo$ = this.weatherService.weatherInfo$;
        this.errors$ = this.messages.errors$;
        this.globalEventsService.globalClickHandler$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.showWeatherMenu = false);
    }

    public toggleMenu(e: Event): void {
        e.stopPropagation();
        this.showWeatherMenu = !this.showWeatherMenu;
    }

    public selectItem(city: WeatherCity, e: Event | null = null, index: number | null = null): void {
        e && e.stopPropagation();
        index !== null && this.refreshSelectedCity(index);
        this.weatherService.getWeatherInfo(city.name, city.code);
        this.showWeatherMenu = false;
    }

    public getCountryText(country: Country): string {
        switch (country) {
            case Country.UA:
                return 'Ua';
            default:
                return '-'
        }
    }

    private refreshSelectedCity(index: number): void {
        this.weatherCities.forEach((city: WeatherCity) => {
            city.selected = false;
        });

        this.weatherCities[index].selected = true;
    }
}
