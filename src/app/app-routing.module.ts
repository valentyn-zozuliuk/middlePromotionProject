import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '',  redirectTo: '/user-console/articles', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: 'user-console', loadChildren: () => import('./user-console/user-console.module')
        .then(m => m.UserConsoleModule) },
    { path: '**', redirectTo: '/user-console/articles' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
