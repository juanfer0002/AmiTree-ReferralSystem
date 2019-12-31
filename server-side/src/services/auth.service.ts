import { ObjectId, ObjectID } from 'bson';
import jwt from 'jsonwebtoken';
import { IAuth, ISignUp, ITokenResponse, PasswordUtils } from '../common/auth/auth';
import { EmailAlreadyInUseError, UnauthorizedError } from '../common/auth/auth-errors';
import { NotValidReferralError } from '../common/referrals/referral-errors';
import { AssertUtils } from '../common/utilities/assert-utils';
import { IReferral } from '../model/referral.model';
import { IUser } from '../model/user.model';
import ReferralRepository from '../repositories/referral.repository';
import UserRepository from '../repositories/user.repository';

const JWT_SECRET_PASS: string = process.env.TOKEN_PASS;
const DAY_IN_SECS = 60 * 60 * 24;

const TOKEN_PREFIX = 'Bearer ';

const MAX_REFERRALS = parseInt(process.env.MAX_REFERRALS_BY_CODE, 10) || 5;
const REFERRED_CREDIT = parseInt(process.env.REFERRED_USER_CREDIT, 10) || 10;
const OWNER_REFERRED_CREDIT = parseInt(process.env.OWNER_REFERRED_USER_CREDIT, 10) || 10;

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
        let referral = null;
        if (referralCode) {
            referral = await AuthService.validateAndGetReferral(referralCode);
            user.credit = REFERRED_CREDIT;
        }

        user.password = PasswordUtils.hash(user.password);
        const savedUser = await UserRepository.save(user);

        if (referral) {
            await AuthService.updateReferralWithJoinedUser(referral, savedUser);
            await AuthService.addCreditToReferralOwnerIfConditionsMet(referral);
        }
    }

    public static async validateReferralCodeIsValid(referralCode: string): Promise<boolean> {
        const isValidId = ObjectId.isValid(referralCode);
        return isValidId && !!(await ReferralRepository.findById(referralCode) || {} as IReferral).active;
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

    private static async validateAndGetReferral(referralCode: string): Promise<IReferral> {
        const referral = await ReferralRepository.findById(referralCode);

        if (!referral || referral.joinedUsers.length >= MAX_REFERRALS) {
            throw new NotValidReferralError();
        }

        return referral;
    }

    private static async addCreditToReferralOwnerIfConditionsMet(referral: IReferral): Promise<void> {

        if (referral.joinedUsers.length == MAX_REFERRALS) {
            const uid = referral.owner._id;
            const ownerUser = await UserRepository.findById(uid);

            ownerUser.credit += OWNER_REFERRED_CREDIT;
            await UserRepository.save(ownerUser);
        }

    }

    private static async updateReferralWithJoinedUser(referral: IReferral, joinedUser: IUser): Promise<void> {
        referral.joinedUsers.push(joinedUser);
        referral.active = referral.joinedUsers.length < MAX_REFERRALS;
        await ReferralRepository.save(referral);
    }

}

export default AuthService;
