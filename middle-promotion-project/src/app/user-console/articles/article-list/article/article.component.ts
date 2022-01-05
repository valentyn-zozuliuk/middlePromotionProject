import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { GlobalEventsService } from 'src/app/global-services/global-events.service';
import { Article, ArticleTypes } from 'src/app/model/article.model';
import { UserProfile } from 'src/app/model/user.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { ArticlesService } from '../../articles.service';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss']
})
export class ArticleComponent extends ClearObservable implements OnInit {
    @Input() article: Article | null = null;
    @Input() userInfo: UserProfile | null = null;

    public showEditMenu: boolean = false;
    public articleTypes: {business: ArticleTypes, productivity: ArticleTypes, meida: ArticleTypes} = {
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

    public ifDaysAgoNeeded(time: number): boolean {
        if (time) {
            const currentDate = new Date().getTime();
            return currentDate - time >= 1728000000;
        }

        return false;
    }

    public toggleMenu(e: Event): void {
        e.stopPropagation();
        this.showEditMenu = !this.showEditMenu;
    }

    public editArticle(e: Event): void {
        e.stopPropagation();
        this.showEditMenu = false;
        this.router.navigate(['/user-console/articles/' + this.article?.uid + '/edit']);
    }

    public deleteArticle(e: Event): void {
        e.stopPropagation();
        this.showEditMenu = false;
        this.articlesService.deleteArticle(this.article?.uid);
    }

    public showArticle(): void {
        this.router.navigate(['/user-console/articles/' + this.article?.uid]);
    }
}
