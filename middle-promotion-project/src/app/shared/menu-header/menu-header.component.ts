import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/model/user.model';

@Component({
    selector: 'app-menu-header',
    templateUrl: './menu-header.component.html',
    styleUrls: ['./menu-header.component.scss']
})
export class MenuHeaderComponent implements OnInit {
    @Input() user: UserProfile | null = null;
    showMenu: boolean = false;

    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    toggleMenu() {
        this.showMenu = !this.showMenu;
    }

    navigateToPage(route: string) {
        this.router.navigate([route]);
    }

}
