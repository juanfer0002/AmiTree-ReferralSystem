import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IReferralInfo } from '../model/referral';


@Injectable()
export class ReferralService {

    planBasedURL = environment.apiUrl + '/referral';

    constructor(private http: HttpClient) {
    }

    createNewReferralCode() {
        return this.http.post<{ code: string }>(this.planBasedURL, {});
    }

    getReferralInfo() {
        return this.http.get<IReferralInfo>(this.planBasedURL);
    }

}
