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

    weatherInfo$: Observable<Weather | null> | null = null;
    $errors: Observable<string[]> | null = null;
    showWeatherMenu: boolean = false;
    weatherCities: WeatherCity[] = [
        { name: City.LVIV, code: 'UA', displayCode: 'Ua', selected: true },
        { name: City.KYIV, code: 'UA', displayCode: 'Ua', selected: false },
        { name: City.ODESA, code: 'UA', displayCode: 'Ua', selected: false },
    ];

    constructor(
        private weatherService: WeatherService,
        private messages: MessagesService,
        private globalEventsService: GlobalEventsService) {
        super();
    }

    ngOnInit(): void {
        this.selectItem(this.weatherCities[0]);
        this.weatherInfo$ = this.weatherService.weatherInfo$;
        this.$errors = this.messages.errors$;
        this.globalEventsService.globalClickHandler$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.showWeatherMenu = false);
    }

    toggleMenu(e: Event) {
        e.stopPropagation();
        this.showWeatherMenu = !this.showWeatherMenu;
    }

    selectItem(city: WeatherCity, e: Event | null = null, index: number | null = null) {
        e && e.stopPropagation();
        index !== null && this.refreshSelectedCity(index);
        this.weatherService.getWeatherInfo(city.name, city.code);
        this.showWeatherMenu = false;
    }

    getCountryText(country: Country) {
        switch (country) {
            case Country.UA:
                return 'Ua';
            default:
                return '-'
        }
    }

    refreshSelectedCity(index: number) {
        this.weatherCities.forEach((city: WeatherCity) => {
            city.selected = false;
        });

        this.weatherCities[index].selected = true;
    }
}
