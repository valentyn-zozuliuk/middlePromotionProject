import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticleOrders, ArticleTypesFilter } from 'src/app/model/article.model';
import { ArticlesService } from '../articles.service';

import { ArticleListComponent } from './article-list.component';

describe('ArticleListComponent', () => {
    let component: ArticleListComponent;
    let fixture: ComponentFixture<ArticleListComponent>;
    let articlesService: jasmine.SpyObj<ArticlesService>;

    beforeEach(async () => {
        const articlesServiceSpy = jasmine.createSpyObj('ArticlesService', ['updateTypeFilter',
         'updateOrderFilter', 'resetFilters']);

        await TestBed.configureTestingModule({
            declarations: [ArticleListComponent],
            imports: [RouterTestingModule, HttpClientModule],
            providers: [{
                provide: ArticlesService,
                useValue: articlesServiceSpy
            }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArticleListComponent);
        component = fixture.componentInstance;
        articlesService = TestBed.inject(ArticlesService) as jasmine.SpyObj<ArticlesService>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set the current filters', () => {
        component.articleTypeFilters[0].selected = false;
        component.articleTypeFilters[1].selected = true;
        component.articleTypeFilters[2].selected = false;
        component.articleTypeFilters[3].selected = false;

        component.articleOrderFilters[0].selected = true;
        component.articleOrderFilters[1].selected = false;

        component.ngOnInit();

        expect(component.selectedTypeFilter).toBe(component.articleTypeFilters[1].name);
        expect(component.selectedOrderFilter).toBe(component.articleOrderFilters[0].name);
    });

    it('should sort by type correctly', () => {
        const event = new Event('click');
        component.sortByType({
            selected: true,
            name: 'Media',
            code: ArticleTypesFilter.MEDIA
        }, event, 2);

        expect(component.articleTypeFilters[2].selected).toBeTruthy();
        expect(component.selectedTypeFilter).toBe(component.articleTypeFilters[2].name);
        expect(articlesService.updateTypeFilter).toHaveBeenCalledTimes(1);
    });

    it('should sort by order correctly', () => {
        const event = new Event('click');
        component.sortByOrder({
            selected: true,
            name: 'Ascending',
            code:  ArticleOrders.ASC
        }, event, 1);

        expect(component.articleOrderFilters[1].selected).toBeTruthy();
        expect(component.selectedOrderFilter).toBe(component.articleOrderFilters[1].name);
        expect(articlesService.updateOrderFilter).toHaveBeenCalledTimes(1);
    });
});
