import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Article, ArticleTypes } from 'src/app/model/article.model';

import { ArticleEditComponent } from './article-edit.component';

describe('ArticleEditComponent', () => {
    let component: ArticleEditComponent;
    let fixture: ComponentFixture<ArticleEditComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
    let article: Article = {
        title: 'Title 2',
        description: 'description',
        type: ArticleTypes.MEDIA,
        createdBy: {
            image: 'src',
            name: 'Val Zoz',
            uid: 'uid'
        },
        updatedDate: 23456,
        uid: undefined,
        coverImage: 'coverImage'
    };

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['login'], {
            user: of(true)
        })

        await TestBed.configureTestingModule({
            declarations: [ArticleEditComponent],
            imports: [RouterTestingModule, ReactiveFormsModule, HttpClientModule],
            providers: [{
                provide: AuthService,
                useValue: authServiceSpy
            }, {
                provide: ActivatedRoute,
                useValue: {
                    params: of({
                        id: 'test id'
                    }),
                    data: of({
                        article: article
                    })
                }
            }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArticleEditComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show add article mode if variable is false', () => {
        component.editMode = false;
        fixture.detectChanges();

        const header = fixture.debugElement.query(By.css('h5'));
        expect(header.nativeElement.textContent).toBe('Add new article');
    });

    it('should show edit article mode if variable is true', () => {
        component.editMode = true;
        fixture.detectChanges();

        const header = fixture.debugElement.query(By.css('h5'));
        expect(header.nativeElement.textContent).toBe('Edit Article');
    });

    it('should pre-populate data and set type filters if edit mode is on', () => {
        component.editMode = true;
        fixture.detectChanges();

        expect(component.articleForm.value).toEqual({ title: article.title, description: article.description,
            type: article.type, image: article.coverImage });
        expect(component.imageHandler.uploadedImage).toBe(article.coverImage);
        expect(component.articleTypeFilters[2].selected).toBeTruthy();
        expect(component.selectedTypeFilter).toBe(component.articleTypeFilters[2].name);
    });
});
