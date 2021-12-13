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

const routes: Routes = [
    {
        path: '', component: ArticlesComponent, children: [
            { path: '', component: ArticleListComponent },
            { path: 'new', component: ArticleEditComponent }
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
        ArticleComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class ArticlesModule { }
