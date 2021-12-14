import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { GlobalEventsService } from 'src/app/global-services/global-events.service';
import { ArticleOrders, ArticleOrderFilter, ArticleTypeFilter, ArticleTypes, Article } from 'src/app/model/article.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { ArticlesService } from '../articles.service';

@Component({
    selector: 'app-article-list',
    templateUrl: './article-list.component.html',
    styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent extends ClearObservable implements OnInit {
    showTypeFilterMenu: boolean = false;
    showOrderFilterMenu: boolean = false;
    selectedTypeFilter: string | undefined = undefined;
    selectedOrderFilter: string | undefined = undefined;

    articleTypeFilters: ArticleTypeFilter[] = [
        { name: 'All Categories', code: 'ALL', selected: true },
        { name: 'Business', code: ArticleTypes.BUSINESS, selected: false },
        { name: 'Productivity', code: ArticleTypes.PRODUCTIVITY, selected: false },
        { name: 'Media', code: ArticleTypes.MEDIA, selected: false },
    ];

    articleOrderFilters: ArticleOrderFilter[] = [
        { name: 'Ascending', code: ArticleOrders.ASC, selected: true },
        { name: 'Descending', code: ArticleOrders.DESC, selected: false }
    ];

    articles$: Observable<Article[] | null> | null = null;

    constructor(
        private router: Router,
        private globalEventsService: GlobalEventsService,
        private articlesService: ArticlesService ) {
        super();
    }

    ngOnInit(): void {
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
    }

    addNewArticle() {
        this.router.navigate(['/user-console/articles/new']);
    }

    toggleTypeFilter(e: Event) {
        e.stopPropagation();
        this.showTypeFilterMenu = !this.showTypeFilterMenu;
    }

    toggleOrderFilter(e: Event) {
        e.stopPropagation();
        this.showOrderFilterMenu = !this.showOrderFilterMenu;
    }

    sortByType(type: ArticleTypeFilter, e: Event | null = null, index: number | null = null) {
        e && e.stopPropagation();
        index !== null && this.refreshTypeFilter(index);
        this.getSelectedType();
        this.showTypeFilterMenu = false;
    }

    sortByOrder(order: ArticleOrderFilter, e: Event | null = null, index: number | null = null) {
        e && e.stopPropagation();
        index !== null && this.refreshOrderFilter(index);
        this.getSelectedOrder();
        this.showOrderFilterMenu = false;
    }

    refreshTypeFilter(index: number) {
        this.articleTypeFilters.forEach((typeFilter: ArticleTypeFilter) => {
            typeFilter.selected = false;
        });

        this.articleTypeFilters[index].selected = true;
    }

    refreshOrderFilter(index: number) {
        this.articleOrderFilters.forEach((sortFilter: ArticleOrderFilter) => {
            sortFilter.selected = false;
        });

        this.articleOrderFilters[index].selected = true;
    }

    getSelectedType() {
        this.selectedTypeFilter = this.articleTypeFilters.find((typeFilter: ArticleTypeFilter) => {
            return typeFilter.selected;
        })?.name;
    }

    getSelectedOrder() {
        this.selectedOrderFilter = this.articleOrderFilters.find((orderFilter: ArticleOrderFilter) => {
            return orderFilter.selected;
        })?.name;
    }
}
