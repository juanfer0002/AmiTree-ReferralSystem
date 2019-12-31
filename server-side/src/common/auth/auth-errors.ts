import { CustomValidationError } from '../utilities/error';

export class UnauthorizedError extends CustomValidationError {

    constructor() {
        super('Email or password wrong.');
    }

    get code() {
        return 401;
    }

}

export class ForbiddenError extends CustomValidationError {

    constructor() {
        super('Auth needed to access this action.');
    }

    get code() {
        return 403;
    }

}

export class EmailAlreadyInUseError extends CustomValidationError {

    constructor() {
        super('Email is already in use. Try another.');
    }

    get code() {
        return 409;
    }

}
