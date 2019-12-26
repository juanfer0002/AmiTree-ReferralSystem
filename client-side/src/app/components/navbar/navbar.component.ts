import { Component, OnInit } from '@angular/core';
import { TOKEN_KEY } from 'src/app/shared/constants/auth.constants';
import { Alert } from 'src/app/shared/utils/alert.utils';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    constructor(private alert: Alert) { }

    ngOnInit() {
    }

    logout() {

        this.alert.showDialog({
            title: 'Logout',
            body: 'Are you sure you want to logout?',
            actions: [
                { text: 'Continue', value: true },
                { text: 'Cancel', value: false }
            ]
        }).subscribe(async (shouldContinue: boolean) => {

            if (shouldContinue) {
                sessionStorage.removeItem(TOKEN_KEY);
                window.location.reload();
            }

        });

    }

}
