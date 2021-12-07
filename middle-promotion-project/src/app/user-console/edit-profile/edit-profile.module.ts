import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', component: EditProfileComponent }
];

@NgModule({
  declarations: [
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EditProfileModule { }
