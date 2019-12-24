import bcrypt from 'bcrypt';
import { IUser } from '../../model/user.model';

export interface IAuth {
    email: string;
    password: string;
    lastConnection: Date;
}

export interface ISignUp {
    user: IUser;
    referral?: string;
}

export interface ITokenResponse {
    token: string;
}

export interface IPasswordRecovery {
    email: string;
}

export interface IPasswordReset {
    password: string;
    token: string;
}

const SALT_ROUNDS = 10;
export class PasswordUtils {

    public static hash(password: string): string {
        return bcrypt.hashSync(password, SALT_ROUNDS);
    }

    public static compare(plainPass: string, hashPass: string): boolean {
        return bcrypt.compareSync(plainPass, hashPass);
    }

}