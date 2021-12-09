import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { GlobalEventsService } from './global-services/global-events.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    host: {
        '(document:click)': 'onClick($event)'
    }
})
export class AppComponent implements OnInit {
    title = 'middle-promotion-project';

    constructor(private auth: AuthService,
                private globalEventsService: GlobalEventsService,
                private elRef: ElementRef) {
    }

    ngOnInit() {
        this.auth.autoLogin();
    }

    onClick(event: Event) {
        this.globalEventsService.catchClick();
    }
}
