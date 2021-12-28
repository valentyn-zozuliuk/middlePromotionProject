import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Article, ArticleTypes } from 'src/app/model/article.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
    selector: 'app-article-desc',
    templateUrl: './article-desc.component.html',
    styleUrls: ['./article-desc.component.scss']
})
export class ArticleDescComponent extends ClearObservable implements OnInit {
    article: Article | null = null;
    articleTypes: {business: ArticleTypes, productivity: ArticleTypes, meida: ArticleTypes} = {
        business: ArticleTypes.BUSINESS,
        productivity: ArticleTypes.PRODUCTIVITY,
        meida: ArticleTypes.MEDIA,
    }

    constructor(private route: ActivatedRoute, public router: Router) {
        super();
     }

    ngOnInit(): void {
        this.route.data
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((response) => {
                if (!response['article']) {
                    this.router.navigate(['/user-console/articles']);
                }

                this.article = response['article'];
            });
    }

    ifDaysAgoNeeded(time: number) {
        if (time) {
            const currentDate = new Date().getTime();
            return currentDate - time >= 1728000000;
        }

        return false;
    }
}
