import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ArticleEditComponent } from './article-edit.component';

describe('ArticleEditComponent', () => {
    let component: ArticleEditComponent;
    let fixture: ComponentFixture<ArticleEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ArticleEditComponent],
            imports: [RouterTestingModule, ReactiveFormsModule, HttpClientModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArticleEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
