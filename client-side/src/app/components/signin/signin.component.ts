import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuth } from 'src/app/model/auth';
import { AuthService } from 'src/app/services/auth.service';
import { TOKEN_KEY, TOKEN_PREFIX } from 'src/app/shared/constants/auth.constants';
import { FORM_ERROR_MSGS, SIGNIN_MSGS } from 'src/app/shared/constants/forms.constants';
import { Alert } from 'src/app/shared/utils/alert.utils';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {


    formErrorMsgs = FORM_ERROR_MSGS;
    signinMsgs = SIGNIN_MSGS;

    submitted = false;
    signinForm: FormGroup;

    constructor(
        private alert: Alert,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.signinForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(254)]),
            password: new FormControl('', [Validators.required, Validators.maxLength(100)])
        });
    }

    get fields() {
        return this.signinForm.controls;
    }

    async signIn() {
        this.submitted = true;
        this.signinForm.markAllAsTouched();

        if (this.signinForm.valid) {
            const auth: IAuth = this.signinForm.value;
            const tokenResponse = await this.authService.signIn(auth).toPromise();

            let token = tokenResponse.token;
            if (token && token.startsWith(TOKEN_PREFIX)) {
                token = token.substring(TOKEN_PREFIX.length);

                sessionStorage.setItem(TOKEN_KEY, token);
                window.location.reload();

            } else {
                this.alert.popError(this.signinMsgs.TOKEN_ERROR);
            }

        } else {
            this.alert.popWarn(this.formErrorMsgs.FORM_ERRORS);
        }

    }


}
