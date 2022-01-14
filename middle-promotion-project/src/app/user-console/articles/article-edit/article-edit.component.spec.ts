import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Article, ArticleTypes } from 'src/app/model/article.model';
import { ArticlesService } from '../articles.service';

import { ArticleEditComponent } from './article-edit.component';

describe('ArticleEditComponent', () => {
    let component: ArticleEditComponent;
    let fixture: ComponentFixture<ArticleEditComponent>;
    let articlesService: jasmine.SpyObj<ArticlesService>;

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
        });

        const articlesServiceSpy = jasmine.createSpyObj('ArticlesService', ['updateArticle', 'addArticle']);

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
            }, {
                provide: ArticlesService,
                useValue: articlesServiceSpy
            }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArticleEditComponent);
        component = fixture.componentInstance;
        articlesService = TestBed.inject(ArticlesService) as jasmine.SpyObj<ArticlesService>;
        //@ts-ignore
        spyOn(component.router, 'navigate').and.returnValue(Promise.resolve(true));
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

        expect(component.articleForm.value).toEqual({
            title: article.title, description: article.description,
            type: article.type, image: article.coverImage
        });
        expect(component.imageHandler.uploadedImage).toBe(article.coverImage);
        expect(component.articleTypeFilters[2].selected).toBeTruthy();
        expect(component.selectedTypeFilter).toBe(component.articleTypeFilters[2].name);
    });

    it('sselect type selects type correctly and sets correct type filters', () => {
        component.editMode = true;
        fixture.detectChanges();

        component.selectType(new Event('click', {
            cancelable: true
        }), 2);

        expect(component.articleTypeFilters[0].selected).toBeFalsy();
        expect(component.articleTypeFilters[1].selected).toBeFalsy();
        expect(component.articleTypeFilters[2].selected).toBeTruthy();
        expect(component.articleForm.get('type')?.value).toEqual(component.articleTypeFilters[2].code);
    });

    it('image upload fails for non-image file format', () => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(new File([''], 'test-file.pdf', {
            type: 'application/pdf'
        }));

        const input = fixture.debugElement.query(By.css('.image-uploader input'));
        input.nativeElement.files = dataTransfer.files;
        input.nativeElement.dispatchEvent(new InputEvent('change'));

        fixture.detectChanges();

        expect(component.imageHandler.errorImageUpload).toBe('Error. Wrong file format.');

    });

    it('image upload works correctly if type is correct', () => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(new File([''], 'test-file.png', {
            type: 'image/png'
        }));

        const input = fixture.debugElement.query(By.css('.image-uploader input'));
        input.nativeElement.files = dataTransfer.files;
        input.nativeElement.dispatchEvent(new InputEvent('change'));
        expect(component.imageHandler.errorImageUpload).toBe('');
    });

    it('form submit produces error if no uploaded image', () => {
        component.editMode = true;
        articlesService.updateArticle.and.returnValue(of([article]));
        component.imageHandler.uploadedImage = "";
        component.onSubmitForm();
        expect(component.imageHandler.errorImageUpload).toBe('Select new image for upload');
    });

    it('valid form submit adds article in mormal mode', () => {
        component.imageHandler.uploadedImage = "src";
        component.editMode = true;
        articlesService.updateArticle.and.returnValue(of([article]));
        component.onSubmitForm();
        expect(component.articleForm.valid).toBeTruthy();
        expect(articlesService.updateArticle).toHaveBeenCalledTimes(1);
    });

    it('valid form submit updates articles in edit mode', () => {
        component.imageHandler.uploadedImage = "src";
        component.editMode = false;
        articlesService.addArticle.and.returnValue(of([article]));
        component.onSubmitForm();
        expect(component.articleForm.valid).toBeTruthy();
        expect(articlesService.addArticle).toHaveBeenCalledTimes(1);
    });
});
