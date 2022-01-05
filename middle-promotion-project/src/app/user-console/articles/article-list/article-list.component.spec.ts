import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ArticleListComponent } from './article-list.component';

describe('ArticleListComponent', () => {
    let component: ArticleListComponent;
    let fixture: ComponentFixture<ArticleListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ArticleListComponent],
            imports: [RouterTestingModule, HttpClientModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArticleListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
