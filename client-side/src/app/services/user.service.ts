import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../model/user';


@Injectable()
export class UserService {

    planBasedURL = environment.apiUrl + '/user';

    constructor(private http: HttpClient) {
    }

    getUsers() {
        return this.http.get<IUser[]>(this.planBasedURL);
    }

    sendPasswordResetEmail() {
        return this.http.post<IUser[]>(this.planBasedURL + '/password-reset-email', null);
    }

}
