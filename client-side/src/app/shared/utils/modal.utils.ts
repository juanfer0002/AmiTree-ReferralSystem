import { Injectable, TemplateRef } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';


@Injectable()
export class Modal {

    constructor(private modalService: MDBModalService) { }

    public show(component: string | TemplateRef<any> | any, config: any = {}): MDBModalRef {
        return this.modalService.show(component, { ignoreBackdropClick: true, ...config });
    }

}


