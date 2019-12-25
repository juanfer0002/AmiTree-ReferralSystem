import { Component, OnDestroy, OnInit, AfterViewInit, } from '@angular/core';

import { Subscription } from 'rxjs';

import { LoadingScreen } from '../../utils/loading-screen.utils';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, AfterViewInit, OnDestroy {

    loading = false;
    loadingSubscription: Subscription;

    constructor(private loadingScreen: LoadingScreen) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.loadingSubscription = this.loadingScreen.loadingStatus.pipe(
            debounceTime(200)
        ).subscribe((value) => {
            this.loading = value;
        });
    }

    ngOnDestroy() {
        this.loadingSubscription.unsubscribe();
    }

}
