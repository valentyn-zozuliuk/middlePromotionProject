import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClearObservable } from './clear-observable/clear-observable';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MenuHeaderComponent } from './menu-header/menu-header.component';
import { MenuSideComponent } from './menu-side/menu-side.component';



@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        MenuHeaderComponent,
        MenuSideComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LoadingSpinnerComponent,
        MenuHeaderComponent,
        MenuSideComponent,
        CommonModule
    ]
})
export class SharedModule { }
