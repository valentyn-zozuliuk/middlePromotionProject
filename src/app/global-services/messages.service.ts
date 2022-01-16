import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {

    private subject = new BehaviorSubject<string[]>([]);

    public errors$: Observable<string[]> = this.subject.asObservable()
        .pipe(
            filter(messages => !!messages)
        );

    public showErrors(...errors: string[]): void {
        this.subject.next(errors);
    }

    public clearMessages(): void {
        this.subject.next([]);
    }
}
