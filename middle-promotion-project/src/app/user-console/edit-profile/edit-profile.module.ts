import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditInformationComponent } from './edit-information/edit-information.component';

const routes: Routes = [
    { path: '', component: EditProfileComponent }
];

@NgModule({
  declarations: [
    EditProfileComponent,
    EditInformationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class EditProfileModule { }
