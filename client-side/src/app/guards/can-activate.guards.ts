import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    UrlTree,
    Router
} from '@angular/router';

import { TOKEN_KEY } from '../shared/constants/auth.constants';


@Injectable()
export class CanActivateRouteGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): UrlTree | boolean {
        const token = sessionStorage.getItem(TOKEN_KEY);
        const targetUrl = route.url.length ? route.url[0].path : '';

        let result: UrlTree | boolean = true;
        switch (targetUrl) {

            case 'signin':
            case 'signup':
                result = this.shouldActivateSigninOrRedirect(token);
                break;

            default:
                result = this.shouldActivateRouteOrRedirect(token);
                break;

        }

        return result;
    }

    shouldActivateSigninOrRedirect(token: string): UrlTree | boolean {
        const isTokenInvalid = !token;
        return isTokenInvalid || (!isTokenInvalid && this.router.createUrlTree(['/dashboard']));
    }

    shouldActivateRouteOrRedirect(token: string): boolean | UrlTree {
        const isTokenValid = !!token;
        return isTokenValid || this.router.createUrlTree(['/signin']);
    }

}
