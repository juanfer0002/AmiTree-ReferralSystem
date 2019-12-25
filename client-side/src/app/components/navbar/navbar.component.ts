import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TOKEN_KEY } from 'src/app/shared/constants/auth.constants';
import { Alert } from 'src/app/shared/utils/alert.utils';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    constructor(private userService: UserService, private alert: Alert) { }

    ngOnInit() {
    }

    resetPassword() {

        this.alert.showDialog({
            title: 'Password Reset',
            body: 'We are about to send a email with a reset password link, do you want to continue?',
            actions: [
                { text: 'Continue', value: true },
                { text: 'Cancel', value: false }
            ]
        }).subscribe(async (shouldSendEmail: boolean) => {

            if (shouldSendEmail) {
                await this.userService.sendPasswordResetEmail().toPromise();
                this.alert.popSuccess('An email has been sent to your inbox, please check it out.');
            }

        });

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
