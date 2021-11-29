import { Component, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    'template': ''
})
export class ClearObservable implements OnDestroy {
    destroy$: Subject<boolean> = new Subject();

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
