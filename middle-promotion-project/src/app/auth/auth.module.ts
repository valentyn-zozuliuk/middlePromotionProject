import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

const routes: Routes = [
    {
        path: '', component: AuthComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'privacy-policy', component: PrivacyPolicyComponent }
        ]
    }
];

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
        ForgotPasswordComponent,
        AuthComponent,
        PrivacyPolicyComponent,
        LoadingSpinnerComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ]
})
export class AuthModule { }
