import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoadingScreen {

    private isLoading = false;
    loadingStatus: Subject<any> = new Subject();

    get loading(): boolean {
        return this.isLoading;
    }

    set loading(value: boolean) {
        this.isLoading = value;
        this.loadingStatus.next(value);
    }

    startLoading() {
        this.loading = true;
    }

    stopLoading() {
        this.loading = false;
    }
}
