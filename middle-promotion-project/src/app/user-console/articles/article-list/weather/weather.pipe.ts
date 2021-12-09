import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'weather'
})
export class WeatherPipe implements PipeTransform {

    transform(value: number, ...args: unknown[]): unknown {
        if (!value) {
            return "-";
        }

        return +Math.round(value);
    }

}
