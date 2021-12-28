import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { combineLatest, map, Observable, take, withLatestFrom } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Article } from "src/app/model/article.model";
import { UserProfile } from "src/app/model/user.model";
import { ArticlesService } from "./articles.service";

@Injectable({providedIn: 'root'})
export class ArticleEditGuard implements CanActivate {
    constructor(private articlesService: ArticlesService, private auth: AuthService, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.articlesService.getArtcleById(route.params['id']);
        return combineLatest([this.auth.user, this.articlesService.singleArticle$])
                .pipe(
                    take(1),
                    map(([user, article]: [UserProfile | null, Article | undefined]) => {

                        if (user && article) {
                            return user?.id === article?.createdBy.uid ? true : this.router.createUrlTree(['/auth/login']);
                        }

                        return this.router.createUrlTree(['/auth/login']);
                    })
                );
    }
}
