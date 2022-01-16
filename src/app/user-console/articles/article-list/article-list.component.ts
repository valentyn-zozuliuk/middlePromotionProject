import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { GlobalEventsService } from 'src/app/global-services/global-events.service';
import {
    ArticleOrders,
    ArticleOrderFilter,
    ArticleTypeFilter, Article, ArticleTypesFilter
} from 'src/app/model/article.model';
import { UserProfile } from 'src/app/model/user.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { ArticlesService } from '../articles.service';

@Component({
    selector: 'app-article-list',
    templateUrl: './article-list.component.html',
    styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent extends ClearObservable implements OnInit {
    public showTypeFilterMenu: boolean = false;
    public showOrderFilterMenu: boolean = false;
    public selectedTypeFilter: string | undefined = undefined;
    public selectedOrderFilter: string | undefined = undefined;

    public articleTypeFilters: ArticleTypeFilter[] = [
        { name: 'All Categories', code: ArticleTypesFilter.ALL, selected: true },
        { name: 'Business', code: ArticleTypesFilter.BUSINESS, selected: false },
        { name: 'Productivity', code: ArticleTypesFilter.PRODUCTIVITY, selected: false },
        { name: 'Media', code: ArticleTypesFilter.MEDIA, selected: false },
    ];

    public articleOrderFilters: ArticleOrderFilter[] = [
        { name: 'Ascending', code: ArticleOrders.ASC, selected: true },
        { name: 'Descending', code: ArticleOrders.DESC, selected: false }
    ];

    public articles$: Observable<Article[] | null> | null = null;

    public userInfo: UserProfile | null = null;

    constructor(
        private router: Router,
        private globalEventsService: GlobalEventsService,
        private articlesService: ArticlesService,
        private auth: AuthService) {
        super();
    }

    ngOnInit(): void {
        this.articlesService.resetFilters();

        this.globalEventsService.globalClickHandler$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.showTypeFilterMenu = false;
                this.showOrderFilterMenu = false;
            });

        this.getSelectedType();
        this.getSelectedOrder();

        this.articles$ = this.articlesService.articles$;

        this.auth.user
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((res: UserProfile | null) => {
                this.userInfo = res;
            });
    }

    public addNewArticle(): void {
        this.router.navigate(['/user-console/articles/new']);
    }

    public toggleTypeFilter(e: Event): void {
        e.stopPropagation();
        this.showTypeFilterMenu = !this.showTypeFilterMenu;
    }

    public toggleOrderFilter(e: Event): void {
        e.stopPropagation();
        this.showOrderFilterMenu = !this.showOrderFilterMenu;
    }

    public sortByType(type: ArticleTypeFilter, e: Event | null = null, index: number | null = null): void {
        e && e.stopPropagation();
        index !== null && this.refreshTypeFilter(index);
        this.getSelectedType();
        this.showTypeFilterMenu = false;
        this.articlesService.updateTypeFilter(type.code);
    }

    public sortByOrder(order: ArticleOrderFilter, e: Event | null = null, index: number | null = null): void {
        e && e.stopPropagation();
        index !== null && this.refreshOrderFilter(index);
        this.getSelectedOrder();
        this.showOrderFilterMenu = false;
        this.articlesService.updateOrderFilter(order.code);
    }

    private refreshTypeFilter(index: number): void {
        this.articleTypeFilters.forEach((typeFilter: ArticleTypeFilter) => {
            typeFilter.selected = false;
        });

        this.articleTypeFilters[index].selected = true;
    }

    private refreshOrderFilter(index: number): void {
        this.articleOrderFilters.forEach((sortFilter: ArticleOrderFilter) => {
            sortFilter.selected = false;
        });

        this.articleOrderFilters[index].selected = true;
    }

    private getSelectedType(): void {
        this.selectedTypeFilter = this.articleTypeFilters.find((typeFilter: ArticleTypeFilter) => {
            return typeFilter.selected;
        })?.name;
    }

    private getSelectedOrder(): void {
        this.selectedOrderFilter = this.articleOrderFilters.find((orderFilter: ArticleOrderFilter) => {
            return orderFilter.selected;
        })?.name;
    }
}
