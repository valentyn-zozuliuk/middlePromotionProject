import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalEventsService {
    private clickSubject$ = new Subject<boolean>();
    globalClickHandler$: Observable<boolean> = this.clickSubject$.asObservable();

    constructor() { }

    catchClick() {
        this.clickSubject$.next(false);
    }
}
