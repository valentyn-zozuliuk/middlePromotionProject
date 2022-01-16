import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalEventsService {
    private clickSubject$ = new Subject<boolean>();
    public globalClickHandler$: Observable<boolean> = this.clickSubject$.asObservable();

    public catchClick(): void {
        this.clickSubject$.next(false);
    }
}
