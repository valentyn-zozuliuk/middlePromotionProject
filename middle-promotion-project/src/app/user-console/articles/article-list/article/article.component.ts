import { Component, Input, OnInit } from '@angular/core';
import { Article, ArticleTypes } from 'src/app/model/article.model';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
    @Input() article: Article | null = null;
    articleTypes: {business: ArticleTypes, productivity: ArticleTypes, meida: ArticleTypes} = {
        business: ArticleTypes.BUSINESS,
        productivity: ArticleTypes.PRODUCTIVITY,
        meida: ArticleTypes.MEDIA,
    }
    constructor() {

    }

    ngOnInit(): void {
    }

}
