import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesComponent } from './articles.component';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WeatherPipe } from './article-list/weather/weather.pipe';
import { WeatherComponent } from './article-list/weather/weather.component';
import { WeekdayPipe } from './article-list/weather/weekday.pipe';
import { ArticleComponent } from './article-list/article/article.component';
import { ArticleDaysAgoPipe } from './article-list/article/article-days-ago.pipe';
import { TextTruncatePipe } from './article-list/article/text-truncate.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticlesResolver } from './articles-resolver.resolver';
import { ArticleDescComponent } from './article-desc/article-desc.component';
import { ArticleEditGuard } from './article-edit.guard';

const routes: Routes = [
    {
        path: '', component: ArticlesComponent, children: [
            { path: '', component: ArticleListComponent },
            { path: 'new', component: ArticleEditComponent },
            { path: ':id', component: ArticleDescComponent, resolve: { article: ArticlesResolver }},
            { path: ':id/edit', component: ArticleEditComponent,
              resolve: { article: ArticlesResolver }, canActivate: [ArticleEditGuard]}
        ]
    }
];

@NgModule({
    declarations: [
        ArticlesComponent,
        ArticleListComponent,
        ArticleEditComponent,
        WeatherPipe,
        WeatherComponent,
        WeekdayPipe,
        ArticleComponent,
        ArticleDaysAgoPipe,
        TextTruncatePipe,
        ArticleDescComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class ArticlesModule { }
