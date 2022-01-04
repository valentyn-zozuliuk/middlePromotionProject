import { Component, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    'template': ''
})
export class ClearObservable implements OnDestroy {
    public destroy$: Subject<boolean> = new Subject();

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
