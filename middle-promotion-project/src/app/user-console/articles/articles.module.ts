import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesComponent } from './articles.component';
import { RouterModule, Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';

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
        ArticleEditComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class ArticlesModule { }
