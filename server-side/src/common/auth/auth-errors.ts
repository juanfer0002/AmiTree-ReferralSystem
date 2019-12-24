export class UnauthorizedError extends Error {

    constructor() {
        super('Email or password wrong.');
    }

    get code() {
        return 401;
    }

}

export class ForbiddenError extends Error {

    constructor() {
        super('Auth needed to access this action.');
    }

    get code() {
        return 403;
    }

}

export class EmailAlreadyInUseError extends Error {

    constructor() {
        super('Email is already in use. Try another.');
    }

    get code() {
        return 409;
    }

}
