export class CurrentActiveReferralError extends Error {

    constructor() {
        super('There is a referral code that is still active for this user.');
    }

    get code() {
        return 409;
    }

}
