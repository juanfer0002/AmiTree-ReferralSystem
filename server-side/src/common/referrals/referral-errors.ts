import { CustomValidationError } from '../utilities/error';

export class CurrentActiveReferralError extends CustomValidationError {

    constructor() {
        super('There is a referral code that is still active for this user.');
    }

    get code() {
        return 409;
    }

}

export class NotValidReferralError extends CustomValidationError {

    constructor() {
        super('The provided referral code is not a valid one or it has already been used.');
    }

    get code() {
        return 409;
    }

}
