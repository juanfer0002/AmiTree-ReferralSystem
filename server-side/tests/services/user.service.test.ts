require('../shared/setup-env');

import { ObjectId } from 'bson';
import { IUser } from "../../src/model/user.model";
import { UserRepository } from '../../src/repositories/user.repository';
import { UserService } from '../../src/services/user.service';

describe('User ', () => {

    const findUserByIdMock = jest.spyOn(UserRepository, "findById");

    beforeEach(async () => {
        findUserByIdMock.mockClear();
    });

    it("should be found by id", async () => {
        findUserByIdMock.mockImplementationOnce(() => Promise.resolve({ _id: new ObjectId() } as IUser));

        const uid = (new ObjectId()).toHexString();
        const user = await UserService.findUserById(uid);

        expect(user).toBeTruthy();

        expect(findUserByIdMock).toHaveBeenCalledTimes(1);
    });

});