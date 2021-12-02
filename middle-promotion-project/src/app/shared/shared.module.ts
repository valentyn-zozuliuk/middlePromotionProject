import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MenuHeaderComponent } from './menu-header/menu-header.component';
import { MenuSideComponent } from './menu-side/menu-side.component';

import { MatIconModule } from '@angular/material/icon';



@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        MenuHeaderComponent,
        MenuSideComponent
    ],
    imports: [
        CommonModule,
        MatIconModule
    ],
    exports: [
        LoadingSpinnerComponent,
        MenuHeaderComponent,
        MenuSideComponent,
        CommonModule,
        MatIconModule
    ]
})
export class SharedModule { }
