import jwt from 'jsonwebtoken';
import { IAuth, ISignUp, ITokenResponse, PasswordUtils } from '../common/auth/auth';
import { EmailAlreadyInUseError, UnauthorizedError } from '../common/auth/auth-errors';
import { AssertUtils } from '../common/utilities/assert-utils';
import { IUser } from '../model/user.model';
import UserRepository from '../repositories/user.repository';

const JWT_SECRET_PASS: string = process.env.TOKEN_PASS;
const DAY_IN_SECS = 60 * 60 * 24;

const TOKEN_PREFIX = 'Bearer ';

class AuthService {

    public static async signIn(auth: IAuth): Promise<ITokenResponse> {
        const user = await UserRepository.findByEmailWithPassword(auth.email);
        const isValid = user && PasswordUtils.compare(auth.password, user.password);

        if (isValid) {
            return { token: TOKEN_PREFIX + AuthService.generateSigninJWT(user) };
        } else {
            throw new UnauthorizedError();
        }
    }

    public static async signUp(signup: ISignUp): Promise<void> {
        const user = signup.user;
        await AuthService.assertUserIsValid(user);

        const referralCode = signup.referral;
        if (referralCode) {
            await AuthService.validateAndAddCreditToReferralUser(referralCode);
            user.credit = 10;
        }

        user.password = PasswordUtils.hash(user.password);
        await UserRepository.save(user);
    }

    private static generateSigninJWT(user: IUser): string {
        const payload = { user: user._id };
        return jwt.sign(payload, JWT_SECRET_PASS, { expiresIn: DAY_IN_SECS });
    }

    private static async assertUserIsValid(user: IUser): Promise<void> {
        await AssertUtils.assertNullOrEmpty(user.firstName, 'First name has not been provided.');
        await AssertUtils.assertNullOrEmpty(user.lastName, 'Last name has not been provided.');
        await AssertUtils.assertNullOrEmpty(user.email, 'Email has not been provided.');
        await AssertUtils.assertNullOrEmpty(user.password, 'Password name has not been provided.');

        await AuthService.assertEmailInUse(user.email);
    }

    private static async assertEmailInUse(email: string): Promise<void> {
        const foundUser = await UserRepository.findByEmail(email);

        if (foundUser) {
            throw new EmailAlreadyInUseError();
        }
    }

    private static async validateAndAddCreditToReferralUser(referralCode: string): Promise<void> {
        // TODO: implement
    }

}

export default AuthService;
