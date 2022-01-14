import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Article, ArticleOrders, ArticleTypes, ArticleTypesFilter } from 'src/app/model/article.model';
import { UserProfile } from 'src/app/model/user.model';

import { ArticlesService } from './articles.service';

describe('ArticlesService', () => {
    let service: ArticlesService;
    let httpTestingController: HttpTestingController;
    let article: Article;
    let reqInitial: TestRequest;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(ArticlesService);
        httpTestingController = TestBed.inject(HttpTestingController);
        article = {
            title: 'title',
            description: 'description',
            type: ArticleTypes.BUSINESS,
            createdBy: {
                image: 'src',
                name: 'Val Zoz',
                uid: 'uid'
            },
            updatedDate: 12345,
            uid: 'uid',
            coverImage: 'coverImage'
        }

        reqInitial = httpTestingController.expectOne(
            req => req.url === 'https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles.json'
        );
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get articles during initialization', () => {
        expect(reqInitial.request.method).toBe('GET');
    });

    it('fetch Artciles should return artcles array with correct uid and emits them', () => {
        const articleCopy1: Article = JSON.parse(JSON.stringify(article));
        articleCopy1.uid = 'key1';
        const articleCopy2: Article = JSON.parse(JSON.stringify(article));
        articleCopy2.uid = 'key2';

        const expectedResult = [
            articleCopy1,
            articleCopy2
        ];

        //@ts-ignore
        spyOn(service.articlesSubject, 'next');

        //@ts-ignore
        service.fetchArtciles()
            .subscribe((res) => {
                expect(res.length).toEqual(2);
                expect(res).toEqual(expectedResult);
                //@ts-ignore
                expect(service.articlesSubject.next).toHaveBeenCalledWith(expectedResult);
            });

        const req = httpTestingController.expectOne(
            req => req.url === 'https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles.json'
        );

        expect(req.request.method).toBe('GET');

        req.flush({
            'key1': JSON.parse(JSON.stringify(article)),
            'key2': JSON.parse(JSON.stringify(article))
        });
    });

    it('delete Artciles should call correct delete API and delete article from the array and emit correct values', () => {
        const uid = 'key1';
        const articleCopy1: Article = JSON.parse(JSON.stringify(article));
        articleCopy1.uid = 'key1';
        const articleCopy2: Article = JSON.parse(JSON.stringify(article));
        articleCopy2.uid = 'key2';

        //@ts-ignore
        service.fetchedArticles = [
            articleCopy1,
            articleCopy2
        ];

        //@ts-ignore
        spyOn(service.articlesSubject, 'next');

        service.deleteArticle(uid);

        const req = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles/${uid}.json`
        );

        expect(req.request.method).toBe('DELETE');
        //@ts-ignore
        expect(service.fetchedArticles.length).toBe(1);
        //@ts-ignore
        expect(service.fetchedArticles[0].uid).toBe('key2');
        //@ts-ignore
        expect(service.articlesSubject.next).toHaveBeenCalledWith(service.fetchedArticles);
    });

    it('update Artcile should call correct update API and update article in the array and emit correct values', () => {
        const uid = 'uid';
        const articleCopy: Article = JSON.parse(JSON.stringify(article));

        article.description = 'new desc';

        //@ts-ignore
        service.fetchedArticles = [
            articleCopy
        ];

        //@ts-ignore
        spyOn(service.articlesSubject, 'next');

        service.updateArticle(JSON.parse(JSON.stringify(article)), uid)
            .subscribe(() => {
                //@ts-ignore
                expect(service.fetchedArticles.length).toBe(1);
                //@ts-ignore
                expect(service.fetchedArticles[0]).toEqual(article);
                //@ts-ignore
                expect(service.articlesSubject.next).toHaveBeenCalledWith(service.fetchedArticles);
            });

        const req = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles/${uid}.json`
        );

        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(article);

        req.flush(article);
    });

    it('add Artcile should call fetch articles API after adding new article', () => {
        const articleCopy: Article = JSON.parse(JSON.stringify(article));

        article.description = 'new desc';

        //@ts-ignore
        service.fetchedArticles = [
            articleCopy
        ];

        //@ts-ignore
        spyOn(service.articlesSubject, 'next');

        service.addArticle(JSON.parse(JSON.stringify(article)))
            .subscribe();

        const req = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles.json`
        );

        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(article);

        req.flush({
            'key1': JSON.parse(JSON.stringify(article)),
            'key2': JSON.parse(JSON.stringify(article))
        });

        const reqAnother = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles.json`
        );

        expect(reqAnother.request.method).toBe('GET');
    });

    it('should correctly update order filter', () => {
        //@ts-ignore
        service.currentFilters.order = ArticleOrders.ASC;
        service.updateOrderFilter(ArticleOrders.DESC);

        //@ts-ignore
        expect(service.currentFilters.order).toBe(ArticleOrders.DESC);
        //@ts-ignore
        expect(service.applyDebounce).toBeFalsy;
    });

    it('should correctly update type filter', () => {
        //@ts-ignore
        service.currentFilters.type = ArticleTypesFilter.BUSINESS;
        service.updateTypeFilter(ArticleTypesFilter.MEDIA);

        //@ts-ignore
        expect(service.currentFilters.type).toBe(ArticleTypesFilter.MEDIA);
        //@ts-ignore
        expect(service.applyDebounce).toBeFalsy();
    });

    it('should correctly update order filter', () => {
        //@ts-ignore
        service.currentFilters.order = ArticleOrders.ASC;
        service.updateOrderFilter(ArticleOrders.DESC);

        //@ts-ignore
        expect(service.currentFilters.order).toBe(ArticleOrders.DESC);
        //@ts-ignore
        expect(service.applyDebounce).toBeFalsy();
    });

    it('should correctly update query filter', () => {
        //@ts-ignore
        service.currentFilters.query = "";
        service.updateQueryFilter("test");

        //@ts-ignore
        expect(service.currentFilters.query).toBe("test");
        //@ts-ignore
        expect(service.applyDebounce).toBeTruthy();
    });

    it('should correctly reset filters', () => {
        //@ts-ignore
        service.currentFilters.order = ArticleOrders.DESC;
        //@ts-ignore
        service.currentFilters.type = ArticleTypesFilter.BUSINESS;
        service.resetFilters();

        //@ts-ignore
        expect(service.currentFilters.order).toBe(ArticleOrders.ASC);
        //@ts-ignore
        expect(service.currentFilters.type).toBe(ArticleTypesFilter.ALL);
    });

    it('should correctly aplly filters', () => {
        //@ts-ignore
        service.currentFilters.type = ArticleTypesFilter.BUSINESS;
        //@ts-ignore
        service.currentFilters.query = '1';

        const articleCopy1: Article = JSON.parse(JSON.stringify(article));
        articleCopy1.uid = 'key1';
        articleCopy1.type = ArticleTypesFilter.BUSINESS;
        articleCopy1.title = 'Title 1';
        articleCopy1.updatedDate = 12345;

        const articleCopy2: Article = JSON.parse(JSON.stringify(article));
        articleCopy2.uid = 'key2';
        articleCopy2.type = ArticleTypesFilter.MEDIA;
        articleCopy2.updatedDate = 23456;
        articleCopy2.title = 'Title 2';

        const articles = [
            articleCopy1,
            articleCopy2
        ];

        //@ts-ignore
        const returedArticles = service.applyFiltersForArticles(articles);

        //@ts-ignore
        expect(returedArticles.length).toBe(1);
        //@ts-ignore
        expect(returedArticles[0]).toEqual(articleCopy1);
    });

    it('should get article by id', () => {
        const articleCopy1: Article = JSON.parse(JSON.stringify(article));
        articleCopy1.uid = 'key1';
        articleCopy1.type = ArticleTypesFilter.BUSINESS;
        articleCopy1.title = 'Title 1';
        articleCopy1.updatedDate = 12345;

        const articleCopy2: Article = JSON.parse(JSON.stringify(article));
        articleCopy2.uid = 'key2';
        articleCopy2.type = ArticleTypesFilter.MEDIA;
        articleCopy2.updatedDate = 23456;
        articleCopy2.title = 'Title 2';

        //@ts-ignore
        service.fetchedArticles = [
            articleCopy1,
            articleCopy2
        ];

        //@ts-ignore
        spyOn(service.singleArticleSubject, 'next');

        service.getArtcleById('key1');

        //@ts-ignore
        expect(service.singleArticleSubject.next).toHaveBeenCalledWith(articleCopy1);

    });

    it('should update author`s articles correctly and pass correct body to request as map object', () => {
        const articleCopy1: Article = JSON.parse(JSON.stringify(article));
        articleCopy1.uid = 'key1';
        articleCopy1.type = ArticleTypesFilter.BUSINESS;
        articleCopy1.title = 'Title 1';
        articleCopy1.updatedDate = 12345;
        articleCopy1.createdBy.uid = 'localId';

        const articleCopy2: Article = JSON.parse(JSON.stringify(article));
        articleCopy2.uid = 'key2';
        articleCopy2.type = ArticleTypesFilter.MEDIA;
        articleCopy2.updatedDate = 23456;
        articleCopy2.title = 'Title 2';

        const expectedBody = {
            key1: {
                title: 'Title 1',
                description: 'description',
                type: 'BUSINESS',
                createdBy: {
                    image: 'test image',
                    name: 'test username',
                    uid: 'localId'
                },
                updatedDate: 12345,
                uid: undefined,
                coverImage: 'coverImage' },
            key2: {
                title: 'Title 2',
                description: 'description',
                type: 'MEDIA',
                createdBy: {
                    image: 'src',
                    name: 'Val Zoz',
                    uid: 'uid'
                },
                updatedDate: 23456,
                uid: undefined,
                coverImage: 'coverImage'
            }
        };

        //@ts-ignore
        service.fetchedArticles = [
            articleCopy1,
            articleCopy2
        ];

        const user = new UserProfile('test@test.com', 'localId', 'idToken', new Date(),
            'test username', 'test image', 24, true);

        //@ts-ignore
        spyOn(service.singleArticleSubject, 'next');

        service.updateAuthorsArticles(user);

        const req = httpTestingController.expectOne(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/articles.json`
        );

        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(expectedBody);

        req.flush({
            'key1': JSON.parse(JSON.stringify(article)),
            'key2': JSON.parse(JSON.stringify(article))
        });

        //@ts-ignore
        expect(service.fetchedArticles[0].createdBy.image).toBe(user.image);
        //@ts-ignore
        expect(service.fetchedArticles[0].createdBy.name).toBe(user.name);
    });
});
