import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ArticleDescComponent } from './article-desc.component';

describe('ArticleDescComponent', () => {
    let component: ArticleDescComponent;
    let fixture: ComponentFixture<ArticleDescComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ArticleDescComponent],
            imports: [RouterTestingModule]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ArticleDescComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
