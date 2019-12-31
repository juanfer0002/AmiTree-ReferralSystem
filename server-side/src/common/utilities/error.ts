
export class CustomValidationError extends Error {

    get code(): number {
        throw new Error('Please override the getter of code when extending from CustomtValidationError.');
    }

}
