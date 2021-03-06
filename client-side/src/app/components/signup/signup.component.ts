import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ISignUp } from 'src/app/model/auth';
import { AuthService } from 'src/app/services/auth.service';
import { FORM_ERROR_MSGS, SIGNUP_MSGS } from 'src/app/shared/constants/forms.constants';
import { Alert } from 'src/app/shared/utils/alert.utils';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


    formErrorMsgs = FORM_ERROR_MSGS;
    signupMsgs = SIGNUP_MSGS;

    disableSubmit = false;
    submitted = false;
    signupForm: FormGroup;

    referral: string = null;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private alert: Alert,
        private authService: AuthService
    ) { }

    ngOnInit() {
        // TODO: receive referral code from url

        this.signupForm = new FormGroup({
            firstName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            lastName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(254)]),
            password: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            repeatPassword: new FormControl('', [Validators.required, Validators.maxLength(100)])
        }, { validators: this.validateSamePasswords });

        this.loadReferralFromURL();
    }

    async loadReferralFromURL() {
        const referralCode = this.activatedRoute.snapshot.params.referralCode;

        if (referralCode) {
            const response = await this.authService.validateReferallCodeIsValid(referralCode).toPromise();
            console.log('response.isValid ', response.isValid );
            this.referral = response.isValid ? referralCode : null;
        }
    }

    get fields() {
        return this.signupForm.controls;
    }

    validateSamePasswords(fromGroup: FormGroup) {
        const fields = fromGroup.controls;
        const repeatPasswordField = fields.repeatPassword;
        const password = fields.password.value;
        const repeatPassword = repeatPasswordField.value;

        const isValid = password === repeatPassword;
        const errors = repeatPasswordField.errors || {};

        if (!isValid) {
            errors.samePasswords = { valid: false };
            repeatPasswordField.setErrors(errors);
        }

        return null;
    }

    async signUp() {
        this.submitted = true;
        this.signupForm.markAllAsTouched();

        if (this.signupForm.valid) {
            const auth: ISignUp = {
                user: this.signupForm.value,
                referral: this.referral
            }

            await this.authService.signUp(auth).toPromise();
            this.alert.popSuccess(this.signupMsgs.SUCCESS);
            this.disableSubmit = true;
            setTimeout(() => this.router.navigate(['/signin']), 2000);
        } else {
            this.alert.popWarn(this.formErrorMsgs.FORM_ERRORS);
        }

    }


}
