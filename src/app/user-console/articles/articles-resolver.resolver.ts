import { Injectable } from '@angular/core';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
    ActivatedRoute
} from '@angular/router';
import { Observable, take } from 'rxjs';
import { Article } from 'src/app/model/article.model';
import { ArticlesService } from './articles.service';

@Injectable({
    providedIn: 'root'
})
export class ArticlesResolver implements Resolve<Article | undefined> {
    constructor(private articlesService: ArticlesService, private route: ActivatedRoute) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Article | undefined> | Article {
        this.articlesService.getArtcleById(route.params['id']);
        return this.articlesService.singleArticle$
            .pipe(
                take(1)
            );
    }
}
