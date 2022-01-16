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


    it('should return true for `ifDaysAgoNeeded` function if date provided is more than 20 days ago', () => {
        const date = new Date();
        date.setDate(date.getDate() - 25);
        const res = component.ifDaysAgoNeeded(date.getTime());

        expect(res).toBeTruthy();
    });

    it('should return false for `ifDaysAgoNeeded` function if date provided is less than 20 days ago', () => {
        const date = new Date();
        date.setDate(date.getDate() - 3);
        const res = component.ifDaysAgoNeeded(date.getTime());

        expect(res).toBeFalsy();
    });
});
