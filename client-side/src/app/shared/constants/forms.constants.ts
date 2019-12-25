export const NUMBER_PATTERN = /^(\d*\.)?\d+$/;
export const PHONE_PATTERN = /^(\(\d+\))?(\s?\d+\s?)+$/;
export const INTEGER_PATTERN = /^\d*$/;
export const PASSWORD_PATTERN = /^(?=.*\w)(?=.+[A-z])(?=.+\d)\S{8,16}$/;

export const FORM_ERROR_MSGS = {
    REQUIRED_ERROR: 'This is field is required',
    EMAIL_ERROR: 'Enter a valid email',
    FORM_ERRORS: 'Please correct form errors, and try again.',
    PHONE_PATTERN: 'Only numbers, parentheses and spaces allowed',
    INTEGER_PATTERN: 'Only numbers allowed',
    NOT_SAME_PASSWORDS: 'Passwords do not match',
    MAX_LENGTH_ERROR: 'You have entered too many characters, please reduce down to:',
    PASSWORD_PATTERN: 'Password must be between 8 and 16 characters long and contain 1 number and 1 letter at least.',
};

export const SIGNIN_MSGS = {
    TOKEN_ERROR: 'An error has ocurred. We cannot continue with the sign in process',
};

export const SIGNUP_MSGS = {
    SUCCESS: 'You account has been created. You will be redirected to the signin page.',
};
