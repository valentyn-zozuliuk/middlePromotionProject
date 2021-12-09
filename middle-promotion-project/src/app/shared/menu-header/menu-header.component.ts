import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { GlobalEventsService } from 'src/app/global-services/global-events.service';
import { UserProfile } from 'src/app/model/user.model';
import { ClearObservable } from '../clear-observable/clear-observable';

@Component({
    selector: 'app-menu-header',
    templateUrl: './menu-header.component.html',
    styleUrls: ['./menu-header.component.scss']
})
export class MenuHeaderComponent extends ClearObservable implements OnInit {
    @Input() user: UserProfile | null = null;
    showMenu: boolean = false;
    allowGlobalEvent: boolean = false;

    constructor(private router: Router, private globalEventsService: GlobalEventsService) {
        super();
     }

    ngOnInit(): void {
        this.globalEventsService.globalClickHandler$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.showMenu = false);
    }

    toggleMenu(e: Event) {
        e.stopPropagation();
        this.showMenu = !this.showMenu;
    }

    navigateToPage(route: string, e: Event) {
        e.stopPropagation();
        this.router.navigate([route]);
        this.showMenu = false;
    }

}
