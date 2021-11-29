import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'middle-promotion-project';

    constructor(private auth: AuthService) {
    }

    ngOnInit() {
        this.auth.autoLogin();
    }
}
