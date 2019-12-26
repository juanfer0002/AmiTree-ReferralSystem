import { Component, OnInit } from '@angular/core';
import { IReferralInfo } from 'src/app/model/referral';
import { IUser } from 'src/app/model/user';
import { ReferralService } from 'src/app/services/referral.service';
import { UserService } from 'src/app/services/user.service';
import { Alert } from 'src/app/shared/utils/alert.utils';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {

    user: IUser = null;
    referralnfo: IReferralInfo = null;

    showNewCodeBtn = false;

    constructor(
        private alert: Alert,
        private userService: UserService,
        private referralService: ReferralService,
    ) { }

    ngOnInit() {
        this.loadCurrentUser();
        this.loadReferralInfo();
    }

    async loadCurrentUser() {
        this.user = await this.userService.getUser().toPromise();
    }

    async loadReferralInfo() {
        this.referralnfo = await this.referralService.getReferralInfo().toPromise();

        const currentCode = this.referralnfo.currentActiveCode;
        this.showNewCodeBtn = currentCode == null || currentCode == '';
    }

    async createNewCode() {
        await this.referralService.createNewReferralCode().toPromise();
        await this.loadReferralInfo();
    }

    copyToClipboard() {
        const urlToCopy = window.location.origin + '/signup/' + this.referralnfo.currentActiveCode;
        Utils.copyToClipboard(urlToCopy);
        this.alert.popSuccess('URL copied to your clipboard!!!')
    }

}
