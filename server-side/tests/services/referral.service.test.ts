require('../shared/setup-env');

import { ObjectId } from 'bson';
import { CurrentActiveReferralError } from '../../src/common/referrals/referral-errors';
import { IReferral } from '../../src/model/referral.model';
import { IUser } from "../../src/model/user.model";
import { ReferralRepository } from '../../src/repositories/referral.repository';
import { UserRepository } from '../../src/repositories/user.repository';
import { ReferralService } from '../../src/services/referral.service';

describe('Referral ', () => {

    const findLatestReferralMock = jest.spyOn(ReferralRepository, "findLatestByOwnerId");
    const countJoinedUsersMock = jest.spyOn(ReferralRepository, "countJoinedUsersByOwner");
    const saveReferralMock = jest.spyOn(ReferralRepository, "save");
    const findUserByIdMock = jest.spyOn(UserRepository, "findById");

    beforeEach(async () => {
        findLatestReferralMock.mockClear();
        countJoinedUsersMock.mockClear();
        saveReferralMock.mockClear();
        findUserByIdMock.mockClear();
    });

    it("should be created by user if not active code exists", async () => {

        findLatestReferralMock.mockImplementationOnce(() => Promise.resolve(null));
        saveReferralMock.mockImplementationOnce(() => Promise.resolve({ _id: new ObjectId() } as IReferral));
        findUserByIdMock.mockImplementationOnce((_id) => Promise.resolve({ _id } as IUser))

        const uid = (new ObjectId()).toHexString();
        const newCode = await ReferralService.createNewReferralForUserId(uid);

        expect(newCode).toBeTruthy();

        expect(findLatestReferralMock).toHaveBeenCalledTimes(1);
        expect(findUserByIdMock).toHaveBeenCalledTimes(1);
        expect(saveReferralMock).toHaveBeenCalledTimes(1);
    });


    it("should NOT be created if there is an active code", async () => {
        expect.hasAssertions();

        findLatestReferralMock.mockImplementationOnce(() => Promise.resolve({
            _id: new ObjectId(),
            joinedUsers: []
        } as IReferral));

        try {
            const uid = (new ObjectId()).toHexString();
            await ReferralService.createNewReferralForUserId(uid);
        } catch (e) {
            expect(e).toBeInstanceOf(CurrentActiveReferralError);

            expect(findLatestReferralMock).toHaveBeenCalledTimes(1);
            expect(findUserByIdMock).not.toHaveBeenCalled();
            expect(saveReferralMock).not.toHaveBeenCalled();
        };
    });


    it("info should be retrieve by uid", async () => {

        const ARBITRATY_COUNT = 7;
        const ARBITRARY_REFERRAL = { _id: new ObjectId() } as IReferral;

        findLatestReferralMock.mockImplementationOnce(() => Promise.resolve(ARBITRARY_REFERRAL));
        countJoinedUsersMock.mockImplementationOnce(() => Promise.resolve(ARBITRATY_COUNT));

        const uid = (new ObjectId()).toHexString();
        const referralInfo = await ReferralService.getReferralInfoByUserId(uid);

        expect(referralInfo).toBeTruthy();
        expect(referralInfo.currentActiveCode).toEqual(ARBITRARY_REFERRAL._id.toHexString());
        expect(referralInfo.ownerId).toEqual(uid);
        expect(referralInfo.totalUsersJoin).toEqual(ARBITRATY_COUNT);
        
        expect(findLatestReferralMock).toHaveBeenCalledTimes(1);
        expect(countJoinedUsersMock).toHaveBeenCalledTimes(1);
    });

});