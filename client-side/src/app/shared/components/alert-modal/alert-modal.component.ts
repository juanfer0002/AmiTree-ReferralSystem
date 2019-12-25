import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Subject } from 'rxjs';

export interface IAlertDialogAction {
    text: string;
    value: any;
}

export interface IAlertDialogOptions {
    title: string;
    body: string;
    actions?: IAlertDialogAction[];
}

const DEFAULT_ACTIONS: IAlertDialogAction[] = [{
    text: 'Ok',
    value: 'ok'
}];

@Component({
    selector: 'app-alert-modal',
    templateUrl: './alert-modal.component.html'
})
export class AlertModalComponent implements OnInit, OnDestroy {

    action: Subject<any> = new Subject();

    @Input() // Populated by MD Modal
    options: IAlertDialogOptions;

    constructor(public modalRef: MDBModalRef) { }

    ngOnInit() {
        if (!this.options.actions || this.options.actions.length == 0) {
            this.options.actions = DEFAULT_ACTIONS;
        }
    }

    ngOnDestroy() {
        this.action.unsubscribe();
    }

    close(result?: any) {
        this.modalRef.hide();
        !!result && this.action.next(result);
        this.action.complete();
    }

}
