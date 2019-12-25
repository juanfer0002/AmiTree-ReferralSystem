import { IUser } from './user';

export interface IAuth {
    email: string;
    password: string;
    lastConnection?: Date;
}

export interface ITokenResponse {
    token: string;
}

export interface ISignUp {
    user: IUser;
    referral?: string;
}
