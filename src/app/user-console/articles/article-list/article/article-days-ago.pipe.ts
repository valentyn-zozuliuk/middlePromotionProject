import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'articleDaysAgo'
})
export class ArticleDaysAgoPipe implements PipeTransform {

    transform(value: number): string {
        const curDate = new Date().getTime();

        const daysAgo = Math.floor((curDate - value) / (1000 * 3600 * 24));

        switch (daysAgo) {
            case 0:
                return 'today';
            case 1:
                return daysAgo + ' day ago';
            default:
                return daysAgo + ' days ago';
        }
    }
}
