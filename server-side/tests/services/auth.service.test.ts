require('../shared/setup-env');

import { ObjectId } from 'bson';
import { IAuth, ISignUp, PasswordUtils } from '../../src/common/auth/auth';
import { UnauthorizedError, EmailAlreadyInUseError } from '../../src/common/auth/auth-errors';
import { IUser } from "../../src/model/user.model";
import { UserRepository } from "../../src/repositories/user.repository";
import { AuthService } from '../../src/services/auth.service';
import { ReferralRepository } from '../../src/repositories/referral.repository';
import { IReferral } from '../../src/model/referral.model';
import { AssertionError } from '../../src/common/utilities/assert-utils';
import { NotValidReferralError } from '../../src/common/referrals/referral-errors';

const TOKEN_PREFIX = 'Bearer ';

describe('User ', () => {

    const findUserByIdMock = jest.spyOn(UserRepository, "findById");
    const findUserByEmailWithPwdMock = jest.spyOn(UserRepository, "findByEmailWithPassword");
    const findUserByEmailMock = jest.spyOn(UserRepository, "findByEmail");
    const saveUserMock = jest.spyOn(UserRepository, "save");

    const pwdCompareMock = jest.spyOn(PasswordUtils, "compare");

    const findReferralByIdMock = jest.spyOn(ReferralRepository, "findById");
    const saveReferralMock = jest.spyOn(ReferralRepository, "save");


    beforeEach(async () => {
        findUserByIdMock.mockClear();
        findUserByEmailWithPwdMock.mockClear();
        findUserByEmailMock.mockClear();
        saveUserMock.mockClear();

        pwdCompareMock.mockClear();

        findReferralByIdMock.mockClear();
        saveReferralMock.mockClear();

    });

    it("should sign in", async () => {

        findUserByEmailWithPwdMock.mockImplementationOnce((email: string) => Promise.resolve({
            _id: new ObjectId(),
            email
        } as IUser));

        pwdCompareMock.mockImplementationOnce(() => true);

        const auth: IAuth = {
            email: 'some@email.com',
            password: '123'
        };

        const response = await AuthService.signIn(auth);

        expect(response).toBeTruthy();
        expect(response.token).toBeTruthy();

        const startWithPrefix = response.token.startsWith(TOKEN_PREFIX);
        expect(startWithPrefix).toBeTruthy();

        expect(findUserByEmailWithPwdMock).toHaveBeenCalledTimes(1);
        expect(pwdCompareMock).toHaveBeenCalledTimes(1);
    });

    it("should NOT sign in if email does not exist", async () => {
        expect.hasAssertions();

        findUserByEmailWithPwdMock.mockImplementationOnce(() => Promise.resolve(null));

        try {
            const auth: IAuth = {
                email: 'some@email.com',
                password: '123'
            };


            await AuthService.signIn(auth);

        } catch (e) {
            expect(e).toBeInstanceOf(UnauthorizedError);

            expect(findUserByEmailWithPwdMock).toHaveBeenCalledTimes(1);
            expect(pwdCompareMock).not.toHaveBeenCalled();
        }
    });

    it("should NOT sign in if passwords do not match", async () => {
        expect.hasAssertions();

        findUserByEmailWithPwdMock.mockImplementationOnce((email: string) => Promise.resolve({
            _id: new ObjectId(),
            email
        } as IUser));

        pwdCompareMock.mockImplementationOnce(() => false);

        try {
            const auth: IAuth = {
                email: 'some@email.com',
                password: '123'
            };


            await AuthService.signIn(auth);

        } catch (e) {
            expect(e).toBeInstanceOf(UnauthorizedError);

            expect(findUserByEmailWithPwdMock).toHaveBeenCalledTimes(1);
            expect(pwdCompareMock).toHaveBeenCalledTimes(1);
        }
    });


    it("should sign up with no referral code", async () => {
        findUserByEmailMock.mockImplementationOnce(() => Promise.resolve(null));

        let savedUser: IUser = null;
        saveUserMock.mockImplementationOnce((userToSave: IUser) => {
            userToSave._id = userToSave._id || new ObjectId();
            savedUser = userToSave;
            return Promise.resolve(savedUser);
        })

        const signUp: ISignUp = {
            user: {
                email: 'some@email.com',
                password: 'pwd',
                firstName: 'firstName',
                lastName: 'secondName',
                credit: 0,
            } as IUser
        };

        await AuthService.signUp(signUp);

        expect(savedUser).toBeTruthy();
        expect(savedUser.credit).toEqual(0);

        expect(findUserByEmailMock).toHaveBeenCalledTimes(1);
        expect(findReferralByIdMock).not.toHaveBeenCalled();

        expect(findUserByIdMock).not.toHaveBeenCalled();
        expect(saveUserMock).toHaveBeenCalledTimes(1);
    });


    it("should sign up with referral code", async () => {
        findUserByEmailMock.mockImplementationOnce(() => Promise.resolve(null));

        let referral = {
            _id: new ObjectId(),
            active: true,
            joinedUsers: []
        } as IReferral;

        findReferralByIdMock.mockImplementationOnce(() => Promise.resolve(referral));
        saveReferralMock.mockImplementationOnce((referralTosave: IReferral) => {
            referral = referralTosave;
            return Promise.resolve(referral);
        })

        let savedUser: IUser = null;
        saveUserMock.mockImplementationOnce((userToSave: IUser) => {
            userToSave._id = userToSave._id || new ObjectId();
            savedUser = userToSave;
            return Promise.resolve(savedUser);
        })


        const signUp: ISignUp = {
            referral: referral._id.toHexString(),
            user: {
                email: 'some@email.com',
                password: 'pwd',
                firstName: 'firstName',
                lastName: 'secondName',
                credit: 0,
            } as IUser
        };

        await AuthService.signUp(signUp);

        expect(savedUser).toBeTruthy();
        expect(savedUser.credit).toEqual(+process.env.REFERRED_CREDIT);

        expect(referral).toBeTruthy();
        expect(referral.joinedUsers).toBeTruthy();
        expect(referral.joinedUsers).toHaveLength(1);

        expect(findUserByEmailMock).toHaveBeenCalledTimes(1);
        expect(findReferralByIdMock).toHaveBeenCalledTimes(1);
        expect(saveReferralMock).toHaveBeenCalledTimes(1);

        expect(findUserByIdMock).not.toHaveBeenCalled();
        expect(saveUserMock).toHaveBeenCalledTimes(1);
    });


    it("should sign up with referral code & add credit to referral owner", async () => {
        findUserByEmailMock.mockImplementationOnce(() => Promise.resolve(null));

        let ownerId = new ObjectId();
        let referral = {
            _id: new ObjectId(),
            owner: { _id: ownerId, credit: 0 } as IUser,
            active: true,
            joinedUsers: new Array(+process.env.MAX_REFERRALS - 1).map(u => {
                u._id = new ObjectId();
                return u;
            })
        } as IReferral;

        findReferralByIdMock.mockImplementationOnce(() => Promise.resolve(referral));
        saveReferralMock.mockImplementationOnce((referralTosave: IReferral) => {
            referral = referralTosave;
            return Promise.resolve(referral);
        })

        findUserByIdMock.mockImplementationOnce(() => Promise.resolve(referral.owner));

        let savedUser: IUser = null;
        saveUserMock.mockImplementation((userToSave: IUser) => {

            if (ownerId.equals(userToSave._id)) {
                referral.owner = userToSave;
            } else {
                userToSave._id = userToSave._id || new ObjectId();
                savedUser = userToSave;
            }

            return Promise.resolve(userToSave);
        })


        const signUp: ISignUp = {
            referral: referral._id.toHexString(),
            user: {
                email: 'some@email.com',
                password: 'pwd',
                firstName: 'firstName',
                lastName: 'secondName',
                credit: 0,
            } as IUser
        };

        await AuthService.signUp(signUp);

        expect(savedUser).toBeTruthy();
        expect(savedUser.credit).toEqual(+process.env.REFERRED_CREDIT);

        expect(referral).toBeTruthy();
        expect(referral.joinedUsers).toBeTruthy();
        expect(referral.joinedUsers).toHaveLength(+process.env.MAX_REFERRALS);
        expect(referral.active).toBeFalsy();

        expect(referral.owner).toBeTruthy();
        expect(referral.owner._id).toEqual(ownerId);
        expect(referral.owner.credit).toEqual(+process.env.OWNER_REFERRED_CREDIT);

        expect(findUserByEmailMock).toHaveBeenCalledTimes(1);
        expect(findReferralByIdMock).toHaveBeenCalledTimes(1);
        expect(saveReferralMock).toHaveBeenCalledTimes(1);

        expect(findUserByIdMock).toHaveBeenCalledTimes(1);
        expect(saveUserMock).toHaveBeenCalledTimes(2);

        saveUserMock.mockRestore();
    });

    it("should NOT sign up if firstName is missing", async () => {
        expect.hasAssertions();

        try {
            const signUp: ISignUp = {
                user: {} as IUser
            };

            await AuthService.signUp(signUp);

        } catch (e) {
            expect(e).toBeInstanceOf(AssertionError);

            expect(findUserByEmailMock).not.toHaveBeenCalled();
            expect(findReferralByIdMock).not.toHaveBeenCalled();

            expect(findUserByIdMock).not.toHaveBeenCalled();
            expect(saveUserMock).not.toHaveBeenCalled();
        }
    });

    it("should NOT sign up if lastName is missing", async () => {
        expect.hasAssertions();

        try {
            const signUp: ISignUp = {
                user: {
                    firstName: 'firstName',
                } as IUser
            };

            await AuthService.signUp(signUp);

        } catch (e) {
            expect(e).toBeInstanceOf(AssertionError);

            expect(findUserByEmailMock).not.toHaveBeenCalled();
            expect(findReferralByIdMock).not.toHaveBeenCalled();

            expect(findUserByIdMock).not.toHaveBeenCalled();
            expect(saveUserMock).not.toHaveBeenCalled();
        }
    });

    it("should NOT sign up if email is missing", async () => {
        expect.hasAssertions();

        try {
            const signUp: ISignUp = {
                user: {
                    firstName: 'firstName',
                    lastName: 'lastName'
                } as IUser
            };

            await AuthService.signUp(signUp);

        } catch (e) {
            expect(e).toBeInstanceOf(AssertionError);

            expect(findUserByEmailMock).not.toHaveBeenCalled();
            expect(findReferralByIdMock).not.toHaveBeenCalled();

            expect(findUserByIdMock).not.toHaveBeenCalled();
            expect(saveUserMock).not.toHaveBeenCalled();
        }
    });

    it("should NOT sign up if password is missing", async () => {
        expect.hasAssertions();

        try {
            const signUp: ISignUp = {
                user: {
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: 'some@email.com'
                } as IUser
            };

            await AuthService.signUp(signUp);

        } catch (e) {
            expect(e).toBeInstanceOf(AssertionError);

            expect(findUserByEmailMock).not.toHaveBeenCalled();
            expect(findReferralByIdMock).not.toHaveBeenCalled();

            expect(findUserByIdMock).not.toHaveBeenCalled();
            expect(saveUserMock).not.toHaveBeenCalled();
        }
    });

    it("should NOT sign up if email already in use", async () => {
        expect.hasAssertions();

        findUserByEmailMock.mockImplementationOnce(() => Promise.resolve({ _id: new ObjectId() } as IUser))

        try {
            const signUp: ISignUp = {
                user: {
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: 'some@email.com',
                    password: '123'
                } as IUser
            };

            await AuthService.signUp(signUp);

        } catch (e) {
            expect(e).toBeInstanceOf(EmailAlreadyInUseError);

            expect(findUserByEmailMock).toHaveBeenCalledTimes(1);
            expect(findReferralByIdMock).not.toHaveBeenCalled();

            expect(findUserByIdMock).not.toHaveBeenCalled();
            expect(saveUserMock).not.toHaveBeenCalled();
        }
    });

    it("should NOT sign up if referral is invalid", async () => {
        expect.hasAssertions();

        findUserByEmailMock.mockImplementationOnce(() => Promise.resolve(null));
        findReferralByIdMock.mockImplementationOnce(() => Promise.resolve(null));

        try {
            const signUp: ISignUp = {
                referral: 'not_valid',
                user: {
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: 'some@email.com',
                    password: '123'
                } as IUser
            };

            await AuthService.signUp(signUp);

        } catch (e) {
            expect(e).toBeInstanceOf(NotValidReferralError);

            expect(findUserByEmailMock).toHaveBeenCalledTimes(1);
            expect(findReferralByIdMock).toHaveBeenCalledTimes(1);

            expect(findUserByIdMock).not.toHaveBeenCalled();
            expect(saveUserMock).not.toHaveBeenCalled();
        }
    });

});