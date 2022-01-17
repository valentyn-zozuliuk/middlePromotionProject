import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, debounce, map, Observable, of, switchMap, tap, throwError, timer } from 'rxjs';
import { MessagesService } from 'src/app/global-services/messages.service';
import { Article, ArticleOrders, ArticleTypesFilter } from 'src/app/model/article.model';
import { UserProfile } from 'src/app/model/user.model';

@Injectable({
    providedIn: 'root'
})
export class ArticlesService {
    private articlesSubject = new BehaviorSubject<Article[] | null>(null);
    private singleArticleSubject = new BehaviorSubject<Article | undefined>(undefined);
    private applyDebounce: boolean = false;

    public articles$: Observable<Article[] | null> = this.articlesSubject.asObservable()
        .pipe(
            map((articles: Article[] | null) => articles ? this.applyFiltersForArticles(articles) : articles),
            debounce(() => this.applyDebounce ? timer(300) : timer(0))
        );

    public singleArticle$: Observable<Article | undefined> = this.singleArticleSubject.asObservable();

    private currentFilters: { type: ArticleTypesFilter, order: ArticleOrders, query: string } = {
        type: ArticleTypesFilter.ALL,
        order: ArticleOrders.ASC,
        query: ""
    }

    private fetchedArticles: Article[] = [];

    constructor(private http: HttpClient, private messages: MessagesService) {
        this.getArticles();
    }

    private getArticles(): void {
        this.fetchArtciles()
            .subscribe();
    }

    private fetchArtciles(): Observable<Article[]> {
        return this.http.get<{[key: string]: Article}>
            (`https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles.json`)
                .pipe(
                    map(response => this.mapArticlesToArray(response)),
                    tap((articles: Article[]) => {
                        this.fetchedArticles = articles.slice();
                        this.articlesSubject.next(articles);
                    })
                );
    }

    public deleteArticle(uid: string | undefined): void {
        if (uid) {
            this.http.delete(`https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles/${uid}.json`).subscribe();
            this.fetchedArticles = this.fetchedArticles.filter(artcile => artcile.uid !== uid);
            this.articlesSubject.next(this.fetchedArticles);
        }
    }

    public updateArticle(articleUpd: Article, uid: string | undefined): Observable<Article[]> {

        if (uid) {
            return this.http.put<Article>(`https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles/${uid}.json`, articleUpd)
                .pipe(
                    tap(() => {
                        this.fetchedArticles = this.fetchedArticles.map(article => article.uid === uid ? {...articleUpd, uid: uid} : article);
                        this.articlesSubject.next(this.fetchedArticles);
                    }),
                    switchMap(() =>
                        of(this.fetchedArticles)
                    ),
                    catchError(error => {
                        this.messages.showErrors('Error occured while editing the Article. Please try again later.');
                        return throwError(() => new Error(error));
                    })
                );
        }

        return this.addArticle(articleUpd);
    }

    public addArticle(articleAdd: Article): Observable<Article[]> {
        return this.http.post(`https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles.json`, articleAdd)
            .pipe(
                switchMap(() =>
                    this.fetchArtciles()
                ),
                catchError(error => {
                    this.messages.showErrors('Error occured while adding a new Article. Please try again later.');
                    return throwError(() => new Error(error));
                })
            );
    }

    private mapArticlesToArray(response: {[key: string]: Article}): Article[] {
        const articles: Article[] = [];
        for (let uid in response) {
            response[uid].uid = uid;
            articles.push(response[uid]);
        }

        return articles;
    }

    private applyFiltersForArticles(articles: Article[]): Article[] {
        return articles
            .filter((article: Article) => {
                let filterPassed = true;

                if (this.currentFilters.type !== ArticleTypesFilter.ALL) {
                    filterPassed = article.type === this.currentFilters.type;
                }

                if (this.currentFilters.query !== "" && filterPassed) {
                    filterPassed = article.title.toLowerCase()
                        .includes(this.currentFilters.query.toLowerCase());
                }

                return filterPassed;
            })
            .sort((a: Article, b: Article) => {
                return this.currentFilters.order === ArticleOrders.ASC ?
                    b.updatedDate - a.updatedDate : a.updatedDate - b.updatedDate;
            });
    }

    public updateOrderFilter(order: ArticleOrders): void {
        this.applyDebounce = false;
        this.currentFilters.order = order;
        this.articlesSubject.next(this.fetchedArticles);
    }

    public updateTypeFilter(type: ArticleTypesFilter): void {
        this.applyDebounce = false;
        this.currentFilters.type = type;
        this.articlesSubject.next(this.fetchedArticles);
    }

    public updateQueryFilter(query: string): void {
        this.applyDebounce = true;
        this.currentFilters.query = query;
        this.articlesSubject.next(this.fetchedArticles);
    }

    public resetFilters(): void {
        this.currentFilters.order = ArticleOrders.ASC;
        this.currentFilters.type = ArticleTypesFilter.ALL;
    }

    public getArtcleById(uid: string): void {
        this.applyDebounce = false;
        this.singleArticleSubject.next(this.fetchedArticles.find((article: Article) => article.uid === uid));
    }

    public updateAuthorsArticles(userProfile: UserProfile): void {
        this.fetchedArticles.forEach((article) =>
            article.createdBy.uid === userProfile.id && this.updateAuthorsData(article, userProfile));

        this.http.put(`https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles.json`,
            this.prepareArticlesForUpdate())
                .subscribe();
    }

    private updateAuthorsData(article: Article, userProfile: UserProfile): void {
        article.createdBy.image = userProfile.image ? userProfile.image : '';
        article.createdBy.name = userProfile.name;
    }

    private prepareArticlesForUpdate(): {[key: string]: Article } {
        const articles: {[key: string]: Article } =
            this.fetchedArticles.reduce((prev: {[key: string]: Article } , curr: Article, index) => {
                return {
                    ...prev,
                    [curr.uid ? curr.uid: '']: {
                        ...curr,
                        uid: undefined
                    }
                };
            }, {});

        return articles;
    }
}
