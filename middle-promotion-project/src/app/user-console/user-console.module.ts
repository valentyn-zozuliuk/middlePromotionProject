import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserConsoleComponent } from './user-console.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    {
        path: '', component: UserConsoleComponent, canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'articles', pathMatch: 'full'},
            { path: 'articles', loadChildren: () => import('./articles/articles.module')
                .then(m => m.ArticlesModule) },
            { path: 'edit-profile', loadChildren: () => import('./edit-profile/edit-profile.module')
                .then(m => m.EditProfileModule) }
        ]
    },
];

@NgModule({
  declarations: [
    UserConsoleComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UserConsoleModule { }
