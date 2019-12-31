import { CustomValidationError } from "./error";

export interface IDateRange { start: Date; end: Date; }
export interface ITimestampRange { start: number; end: number; }

export class AssertUtils {

    public static assertNull(value: any, assertionMsg?: string) {
        if (value == null) {
            throw new NullAssertionError(assertionMsg);
        }
    }

    public static assertNullOrEmpty(value: any, assertionMsg?: string) {
        AssertUtils.assertNull(value, assertionMsg);

        if (value == '') {
            throw new EmptyAssertionError(assertionMsg);
        }
    }

}

export class AssertionError extends CustomValidationError {

    constructor() {
        super('A validation has failed, communicate with support.');
    }

    get code() {
        return 409;
    }
}

export class NullAssertionError extends Error {

    constructor(msg: string = 'Variable is null') {
        super(msg);
    }

}

export class EmptyAssertionError extends Error {

    constructor(msg: string = 'Variable is empty') {
        super(msg);
    }

}
