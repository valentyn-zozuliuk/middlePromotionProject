import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
    selector: 'app-article-list',
    templateUrl: './article-list.component.html',
    styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent extends ClearObservable implements OnInit {

    constructor(private router: Router) {
        super();
    }

    ngOnInit(): void {
    }

    addNewArticle() {
        this.router.navigate(['/user-console/articles/new']);
    }

}
