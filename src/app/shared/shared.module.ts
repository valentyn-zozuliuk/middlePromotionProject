import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MenuHeaderComponent } from './menu-header/menu-header.component';
import { MenuSideComponent } from './menu-side/menu-side.component';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { DragAndDropDirective } from './drag-and-drop.directive';



@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        MenuHeaderComponent,
        MenuSideComponent,
        DragAndDropDirective
    ],
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule
    ],
    exports: [
        LoadingSpinnerComponent,
        MenuHeaderComponent,
        MenuSideComponent,
        CommonModule,
        MatIconModule,
        MatCardModule,
        FormsModule,
        MatTabsModule,
        DragAndDropDirective
    ]
})
export class SharedModule { }
