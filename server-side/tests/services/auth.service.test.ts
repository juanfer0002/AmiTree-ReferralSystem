require('../shared/setup-env');

import { ObjectId } from 'bson';
import { IAuth, PasswordUtils } from '../../src/common/auth/auth';
import User, { IUser } from "../../src/model/user.model";
import { UserRepository } from "../../src/repositories/user.repository";
import { AuthService } from '../../src/services/auth.service';
import { UnauthorizedError } from '../../src/common/auth/auth-errors';

const TOKEN_PREFIX = 'Bearer ';

describe('User ', () => {

    const findByEmailMock = jest.spyOn(UserRepository, "findByEmailWithPassword");
    const pwdCompare = jest.spyOn(PasswordUtils, "compare");

    beforeEach(async () => {
        findByEmailMock.mockClear();
        pwdCompare.mockClear();
    });

    it("should sign sign in", async () => {

        findByEmailMock.mockImplementationOnce((email: string) => Promise.resolve({
            _id: new ObjectId(),
            email
        } as IUser));

        pwdCompare.mockImplementationOnce(() => true);

        const auth: IAuth = {
            email: 'some@email.com',
            password: '123'
        };

        const response = await AuthService.signIn(auth);

        expect(response).toBeTruthy();
        expect(response.token).toBeTruthy();

        const startWithPrefix = response.token.startsWith(TOKEN_PREFIX);
        expect(startWithPrefix).toBeTruthy();

        expect(findByEmailMock).toHaveBeenCalledTimes(1);
        expect(pwdCompare).toHaveBeenCalledTimes(1);
    });

    it("should NOT sign sign in if email does not exist", async () => {
        expect.hasAssertions();

        findByEmailMock.mockImplementationOnce(() => Promise.resolve(null));

        try {
            const auth: IAuth = {
                email: 'some@email.com',
                password: '123'
            };


            await AuthService.signIn(auth);

        } catch (e) {
            expect(e).toBeInstanceOf(UnauthorizedError);

            expect(findByEmailMock).toHaveBeenCalledTimes(1);
            expect(pwdCompare).not.toHaveBeenCalled();
        }
    });

    it("should NOT sign sign in if passwords do not match", async () => {
        expect.hasAssertions();

        findByEmailMock.mockImplementationOnce((email: string) => Promise.resolve({
            _id: new ObjectId(),
            email
        } as IUser));

        pwdCompare.mockImplementationOnce(() => false);

        try {
            const auth: IAuth = {
                email: 'some@email.com',
                password: '123'
            };


            await AuthService.signIn(auth);

        } catch (e) {
            expect(e).toBeInstanceOf(UnauthorizedError);

            expect(findByEmailMock).toHaveBeenCalledTimes(1);
            expect(pwdCompare).toHaveBeenCalledTimes(1);
        }
    });

});