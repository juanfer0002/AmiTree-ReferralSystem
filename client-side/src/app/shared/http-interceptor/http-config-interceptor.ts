import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { TOKEN_KEY, TOKEN_PREFIX } from '../constants/auth.constants';
import { LoadingScreen } from '../utils/loading-screen.utils';
import { Alert } from '../utils/alert.utils';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    activeRequests = 0;

    constructor(
        private alert: Alert,
        private loadingScreen: LoadingScreen
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.activateLoadingScreen();

        request = this.addTokenToRequest(request);
        request = this.addContentTypeToRequest(request);
        request = this.addAcceptToRequest(request);

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => event),
            catchError((error: HttpErrorResponse) => this.handleError(error)),
            finalize(this.deactivateLoadingScreen.bind(this))
        );
    }

    activateLoadingScreen() {
        if (this.activeRequests === 0) {
            this.loadingScreen.startLoading();
        }

        this.activeRequests++;
    }

    deactivateLoadingScreen() {
        this.activeRequests--;

        if (this.activeRequests === 0) {
            this.loadingScreen.stopLoading();
        }
    }

    addTokenToRequest(request: HttpRequest<any>) {
        const token = sessionStorage.getItem(TOKEN_KEY);
        return token
            ? request.clone({ headers: request.headers.set('Authorization', TOKEN_PREFIX + token) })
            : request;
    }

    addContentTypeToRequest(request: HttpRequest<any>) {
        return !request.headers.has('Content-Type')
            ? request.clone({ headers: request.headers.set('Content-Type', 'application/json') })
            : request;
    }

    addAcceptToRequest(request: HttpRequest<any>) {
        return request.clone({ headers: request.headers.set('Accept', 'application/json') });
    }

    handleError(error: HttpErrorResponse) {
        const status = error.status;

        switch (status) {
            case 401:
                this.alert.popError('Email or password wrong.');
                break;

            case 403:
                this.alert.popError('You are not authorize to execute this action.');
                sessionStorage.removeItem(TOKEN_KEY);
                setTimeout(() => window.location.reload(), 2000);
                break;

            case 409:
                const serverMsg = error.error;
                this.alert.popError(serverMsg);
                break;

            default:
                this.alert.popError('Sorry, An internal error has occurred.');
                break;
        }

        return throwError(error);
    }

}
