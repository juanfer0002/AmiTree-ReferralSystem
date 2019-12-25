import { Component } from '@angular/core';
import { TOKEN_KEY } from './shared/constants/auth.constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    isUserLogged = false;

    constructor() {
        const token = sessionStorage.getItem(TOKEN_KEY);
        this.isUserLogged = !!token;
    }

}
