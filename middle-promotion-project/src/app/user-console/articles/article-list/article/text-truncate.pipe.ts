import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textTruncate'
})
export class TextTruncatePipe implements PipeTransform {

    transform(value: string, ...args: number[]): string {

        const maxChars = args[0] ? args[0] : 100;

        if (value.length > maxChars) {
            return value.substring(0, maxChars) + '...';
        }

        return value;
    }

}
