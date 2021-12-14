import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { Article, ArticleOrders, ArticleTypes, ArticleTypesFilter } from 'src/app/model/article.model';

@Injectable({
    providedIn: 'root'
})
export class ArticlesService {
    private recipesSubject = new BehaviorSubject<Article[] | null>(null);
    articles$: Observable<Article[] | null> = this.recipesSubject.asObservable()
        .pipe(
            map((articles: Article[] | null) => articles ? this.applyFiltersForArticles(articles) : articles)
        );

    private currentFilters: { type: ArticleTypesFilter, order: ArticleOrders, query: string } = {
        type: ArticleTypesFilter.ALL,
        order: ArticleOrders.ASC,
        query: ""
    }

    private fetchedArticles: Article[] = [];

    constructor() {
        this.getRecipes();
     }

    getRecipes() {
        const articles: Article[] = [
            {
                title: 'Test Title',
                description: `dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd dsdad sdasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad`,
                type: ArticleTypes.BUSINESS,
                createdBy: {
                    image: "",
                    name: "Test Name 1"
                },
                updatedDate: new Date(2021, 11, 13).getTime()
            },
            {
                title: 'Test Title 2',
                description: `dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad asdasddsd`,
                type: ArticleTypes.PRODUCTIVITY,
                createdBy: {
                    image: "",
                    name: "Test Name 2"
                },
                updatedDate: new Date(111111111111).getTime()
            },
            {
                title: 'Test Title 3',
                description: `dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad asdasddsd oooooo`,
                type: ArticleTypes.MEDIA,
                createdBy: {
                    image: "",
                    name: "Test Name 3"
                },
                updatedDate: new Date(2021, 11, 4).getTime()
            },
            {
                title: 'Test Title 4',
                description: `dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad asdasddsd oooooo`,
                type: ArticleTypes.MEDIA,
                createdBy: {
                    image: "",
                    name: "Test Name 4"
                },
                updatedDate: new Date(2021, 11, 5).getTime()
            }
        ];

        of(articles)
            .pipe(
                tap((articles: Article[]) => {
                    this.fetchedArticles = articles.slice();
                    this.recipesSubject.next(articles);
                })
            )
            .subscribe();

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
        this.currentFilters.order = order;
        this.recipesSubject.next(this.fetchedArticles);
    }

    updateTypeFilter(type: ArticleTypesFilter) {
        this.currentFilters.type = type;
        this.recipesSubject.next(this.fetchedArticles);
    }

    updateQueryFilter(query: string) {
        this.currentFilters.query = query;
        this.recipesSubject.next(this.fetchedArticles);
    }
}
