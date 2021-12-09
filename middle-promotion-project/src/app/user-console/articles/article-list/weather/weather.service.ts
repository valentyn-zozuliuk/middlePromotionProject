import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, tap, throwError } from 'rxjs';
import { MessagesService } from 'src/app/global-services/messages.service';
import { City, Weather, WeatherResponce } from 'src/app/model/weather-info.model';

export const weatherRequestConfig = {
    baseUrl: 'https://community-open-weather-map.p.rapidapi.com/weather',
    defaultHeaders: new HttpHeaders({
        'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
        'x-rapidapi-key': '8e02fccc1dmsh7df5f5d1ae6b72bp17ce33jsnef5b7619f409'
    })
}


@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    private weatherSubject = new BehaviorSubject<Weather | null>(null);
    weatherInfo$ = this.weatherSubject.asObservable();

    constructor(private http: HttpClient, private messages: MessagesService) {
    }

    getWeatherInfo(city: City, code: string) {
        const weatherParams = new HttpParams().set('q', city + ',' + code).set('units', 'metric');

        const weatherInfo$ = this.http.get<WeatherResponce>(weatherRequestConfig.baseUrl, {
            headers: weatherRequestConfig.defaultHeaders,
            params: weatherParams
        }).pipe(
            catchError(error => {
                this.messages.showErrors('Weather API problem');
                return throwError(() => new Error(error));
            }),
            map((weatherRes: WeatherResponce) => {
                const weatherParsed: Weather = {
                    temperature: weatherRes.main.temp,
                    city: weatherRes.name,
                    country: weatherRes.sys.country,
                    date: new Date(),
                    weekDay: new Date().getDay(),
                    icon: weatherRes.weather[0].icon
                }
                return weatherParsed;
            }),
            tap(weather => this.weatherSubject.next(weather))
        );

        weatherInfo$.subscribe();
    }
}
