import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { Alert } from 'src/app/shared/utils/alert.utils';
import { Modal } from 'src/app/shared/utils/modal.utils';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    users: IUser[] = [];

    constructor(
        private alert: Alert,
        private modal: Modal,
        private userService: UserService,

    ) { }

    ngOnInit() {
    }

}
