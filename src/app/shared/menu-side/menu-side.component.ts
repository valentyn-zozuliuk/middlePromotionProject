import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu-side',
    templateUrl: './menu-side.component.html',
    styleUrls: ['./menu-side.component.scss']
})
export class MenuSideComponent implements OnInit {
    @Output() logout = new EventEmitter<void>();
    @Input() isDashboard: boolean = false;

    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    public navigateToDashboard(): void {
        this.router.navigate(['/user-console/articles']);
    }

    public logoutHandler(): void {
        this.logout.emit();
    }
}
