import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { GlobalEventsService } from 'src/app/global-services/global-events.service';
import { Article, ArticleTypes } from 'src/app/model/article.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { ArticlesService } from '../../articles.service';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss']
})
export class ArticleComponent extends ClearObservable implements OnInit {
    @Input() article: Article | null = null;

    showEditMenu: boolean = false;
    articleTypes: {business: ArticleTypes, productivity: ArticleTypes, meida: ArticleTypes} = {
        business: ArticleTypes.BUSINESS,
        productivity: ArticleTypes.PRODUCTIVITY,
        meida: ArticleTypes.MEDIA,
    }

    constructor(
        private globalEventsService: GlobalEventsService,
        private articlesService: ArticlesService,
        private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.globalEventsService.globalClickHandler$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.showEditMenu = false);
    }

    ifDaysAgoNeeded(time: number) {
        if (time) {
            const currentDate = new Date().getTime();
            return currentDate - time >= 1728000000;
        }

        return false;
    }

    toggleMenu(e: Event) {
        e.stopPropagation();
        this.showEditMenu = !this.showEditMenu;
    }

    editArticle(e: Event) {
        e.stopPropagation();
        this.showEditMenu = false;
        this.router.navigate(['/user-console/articles/' + this.article?.uid + '/edit']);
    }

    deleteArticle(e: Event) {
        e.stopPropagation();
        this.showEditMenu = false;
        this.articlesService.deleteArticle(this.article?.uid);
    }

    showArticle() {
        this.router.navigate(['/user-console/articles/' + this.article?.uid]);
    }
}
