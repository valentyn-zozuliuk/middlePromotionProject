import { Component, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { MessagesService } from 'src/app/global-services/messages.service';
import { Weather } from 'src/app/model/weather-info.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { WeatherService } from './weather.service';

@Component({
    selector: 'app-weather',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss']
})
export class WeatherComponent extends ClearObservable implements OnInit {

    weatherInfo$: Observable<Weather | null> | null = null;
    $errors: Observable<string[]> | null = null;

    constructor(private weatherService: WeatherService, private messages: MessagesService) {
        super();
    }

    ngOnInit(): void {
       this.weatherService.getWeatherInfo();
       this.weatherInfo$ = this.weatherService.weatherInfo$;
       this.$errors = this.messages.errors$;
    }

}
