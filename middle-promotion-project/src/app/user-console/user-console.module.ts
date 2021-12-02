import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserConsoleComponent } from './user-console.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
    {
        path: '', component: UserConsoleComponent, canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'articles', pathMatch: 'full'},
            { path: 'articles', loadChildren: () => import('./articles/articles.module')
                .then(m => m.ArticlesModule) },
            { path: 'edit-profile', loadChildren: () => import('./edit-profile/edit-profile.module') }
        ]
    },
];

@NgModule({
  declarations: [
    UserConsoleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UserConsoleModule { }
