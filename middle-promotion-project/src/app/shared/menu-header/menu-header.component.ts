import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { GlobalEventsService } from 'src/app/global-services/global-events.service';
import { UserProfile } from 'src/app/model/user.model';
import { ArticlesService } from 'src/app/user-console/articles/articles.service';
import { ClearObservable } from '../clear-observable/clear-observable';

@Component({
    selector: 'app-menu-header',
    templateUrl: './menu-header.component.html',
    styleUrls: ['./menu-header.component.scss']
})
export class MenuHeaderComponent extends ClearObservable implements OnInit {
    @Input() user: UserProfile | null = null;
    @Input() isDashboard: boolean = false;

    public showMenu: boolean = false;
    public articleQuery: string = "";

    constructor(
        private router: Router,
        private globalEventsService: GlobalEventsService,
        private articlesService: ArticlesService) {
        super();
    }

    ngOnInit(): void {
        this.globalEventsService.globalClickHandler$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.showMenu = false);
    }

    public toggleMenu(e: Event): void {
        e.stopPropagation();
        this.showMenu = !this.showMenu;
    }

    public navigateToPage(route: string, e: Event): void {
        e.stopPropagation();
        this.router.navigate([route]);
        this.showMenu = false;
    }

    public changeArticleQuery(): void {
        this.articlesService.updateQueryFilter(this.articleQuery);
    }
}
