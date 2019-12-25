import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AlertModalComponent, IAlertDialogOptions } from '../components/alert-modal/alert-modal.component';
import { Modal } from './modal.utils';
import { Observable } from 'rxjs';


@Injectable()
export class Alert {

    constructor(public notifierService: NotifierService, private modal: Modal) { }

    public popDefault(msg: string) {
        this.popImpl('default', msg);
    }

    public popInfo(msg: string) {
        this.popImpl('info', msg);
    }

    public popSuccess(msg: string) {
        this.popImpl('success', msg);
    }

    public popWarn(msg: string) {
        this.popImpl('warning', msg);
    }

    public popError(msg: string) {
        this.popImpl('error', msg);
    }

    private popImpl(type: string, msg: string) {
        this.notifierService.notify(type, msg);
    }

    public showDialog(options: IAlertDialogOptions): Observable<any> {
        const modalOpts = { data: { options } };
        const openModal = this.modal.show(AlertModalComponent, modalOpts);

        return openModal.content.action;
    }

}
