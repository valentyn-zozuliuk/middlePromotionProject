import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

    tabIndex: number = 0;
    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    backToDashboard() {
        this.router.navigate(['/user-console/articles']);
    }

    changeTab(e: MatTabChangeEvent) {
        this.tabIndex = e.index;
    }

}
