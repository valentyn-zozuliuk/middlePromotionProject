import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Article, ArticleTypes } from 'src/app/model/article.model';

@Injectable({
    providedIn: 'root'
})
export class ArticlesService {
    private recipesSubject = new BehaviorSubject<Article[] | null>(null);
    articles$: Observable<Article[] | null> = this.recipesSubject.asObservable();

    constructor() {
        this.getRecipes();
     }

    getRecipes() {
        const articles: Article[] = [
            {
                title: 'Test Title',
                description: `dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad
                dasdsasadd dsddd ddd ddd dd d d d d ddddd ddd d ddd sdsdad`,
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
            }
        ];

        of(articles)
            .pipe(
                tap((articles: Article[]) => {
                    this.recipesSubject.next(articles);
                })
            )
            .subscribe();

    }
}
