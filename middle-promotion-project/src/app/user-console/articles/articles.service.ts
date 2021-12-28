import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, debounce, debounceTime, EMPTY, map, Observable, of, tap, timer } from 'rxjs';
import { Article, ArticleOrders, ArticleTypes, ArticleTypesFilter } from 'src/app/model/article.model';

@Injectable({
    providedIn: 'root'
})
export class ArticlesService {
    private articlesSubject = new BehaviorSubject<Article[] | null>(null);
    private singleArticleSubject = new BehaviorSubject<Article | undefined>(undefined);
    private applyDebounce: boolean = false;

    articles$: Observable<Article[] | null> = this.articlesSubject.asObservable()
        .pipe(
            map((articles: Article[] | null) => articles ? this.applyFiltersForArticles(articles) : articles),
            debounce(() => this.applyDebounce ? timer(300) : timer(0))
        );

    singleArticle$: Observable<Article | undefined> = this.singleArticleSubject.asObservable();

    private currentFilters: { type: ArticleTypesFilter, order: ArticleOrders, query: string } = {
        type: ArticleTypesFilter.ALL,
        order: ArticleOrders.ASC,
        query: ""
    }

    private fetchedArticles: Article[] = [];

    constructor(private http: HttpClient) {
        this.getArticles();
    }

    getArticles() {
        this.http.get<{[key: string]: Article}>(`https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles.json`)
            .pipe(
                map(response => this.mapArticlesToArray(response)),
                tap((articles: Article[]) => {
                    this.fetchedArticles = articles.slice();
                    this.articlesSubject.next(articles);
                })
            )
            .subscribe();
    }

    deleteArticle(uid: string | undefined) {
        if (uid) {
            this.http.delete(`https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles/${uid}.json`).subscribe();
            this.fetchedArticles = this.fetchedArticles.filter(artcile => artcile.uid !== uid);
            this.articlesSubject.next(this.fetchedArticles);
        }
    }

    updateArticle(articleUpd: Article) {
        const uid = articleUpd.uid;
        const artcileCopy = {
            ...articleUpd,
            uid: undefined
        }
        this.http.put(`https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles/${uid}.json`, artcileCopy).subscribe();
        this.fetchedArticles.forEach(article => article.uid === articleUpd.uid && (article = articleUpd));
        this.articlesSubject.next(this.fetchedArticles);
    }

    addArticle(articleAdd: Article) {
        this.http.post(`https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles.json`, articleAdd).subscribe();
        this.getArticles();
    }

    mapArticlesToArray(response: {[key: string]: Article}) {
        const articles: Article[] = [];
        for (let uid in response) {
            response[uid].uid = uid;
            articles.push(response[uid]);
        }

        return articles;
    }

    private applyFiltersForArticles(articles: Article[]) {
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

    updateOrderFilter(order: ArticleOrders) {
        this.applyDebounce = false;
        this.currentFilters.order = order;
        this.articlesSubject.next(this.fetchedArticles);
    }

    updateTypeFilter(type: ArticleTypesFilter) {
        this.applyDebounce = false;
        this.currentFilters.type = type;
        this.articlesSubject.next(this.fetchedArticles);
    }

    updateQueryFilter(query: string) {
        this.applyDebounce = true;
        this.currentFilters.query = query;
        this.articlesSubject.next(this.fetchedArticles);
    }

    resetFilters() {
        this.currentFilters.order = ArticleOrders.ASC;
        this.currentFilters.type = ArticleTypesFilter.ALL;
    }

    getArtcleById(uid: string) {
        this.applyDebounce = false;
        this.singleArticleSubject.next(this.fetchedArticles.find((article: Article) => article.uid === uid));
    }
}
