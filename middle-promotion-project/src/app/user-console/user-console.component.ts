import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ClearObservable } from '../shared/clear-observable/clear-observable';

@Component({
    selector: 'app-user-console',
    templateUrl: './user-console.component.html',
    styleUrls: ['./user-console.component.scss']
})
export class UserConsoleComponent extends ClearObservable implements OnInit {
    routerDashboard: boolean = false;

    constructor(private auth: AuthService, private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.routerDashboard = this.router.url === '/user-console/articles';
        this.router.events
        .pipe(
            takeUntil(this.destroy$)
        )
         .subscribe((res: Event) => {

            if (res instanceof NavigationEnd) {
                this.routerDashboard = res.url === '/user-console/articles';
            }

        })
    }

    onLogoutEvent() {
        this.auth.logout();
    }

}
