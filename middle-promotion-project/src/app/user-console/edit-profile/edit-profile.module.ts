import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditInformationComponent } from './edit-information/edit-information.component';
import { EditAvatarComponent } from './edit-avatar/edit-avatar.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    { path: '', component: EditProfileComponent }
];

@NgModule({
  declarations: [
    EditProfileComponent,
    EditInformationComponent,
    EditAvatarComponent,
    EditPasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class EditProfileModule { }
