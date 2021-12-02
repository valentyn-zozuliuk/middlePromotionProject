import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-menu-side',
    templateUrl: './menu-side.component.html',
    styleUrls: ['./menu-side.component.scss']
})
export class MenuSideComponent implements OnInit {
    @Output() logout = new EventEmitter<void>();

    constructor() { }

    ngOnInit(): void {
    }

    logoutHandler() {
        this.logout.emit();
    }
}
