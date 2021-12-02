import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-user-console',
    templateUrl: './user-console.component.html',
    styleUrls: ['./user-console.component.scss']
})
export class UserConsoleComponent implements OnInit {

    constructor(private auth: AuthService) { }

    ngOnInit(): void {
    }

    onLogoutEvent() {
        console.log('hadnel');
        this.auth.logout();
    }

}
