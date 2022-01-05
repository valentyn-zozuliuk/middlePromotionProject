import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
    let component: ArticleComponent;
    let fixture: ComponentFixture<ArticleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ArticleComponent],
            imports: [HttpClientModule, RouterTestingModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArticleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
