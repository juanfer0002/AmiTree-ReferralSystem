import { IReferralInfo } from '../common/referrals/referral';
import { CurrentActiveReferralError } from '../common/referrals/referral-errors';
import { IReferral } from '../model/referral.model';
import { ReferralRepository } from '../repositories/referral.repository';
import { UserRepository } from '../repositories/user.repository';

export class ReferralService {

    public static async createNewReferralForUserId(uid: string): Promise<string> {
        await ReferralService.assertCurrentRefferalExists(uid);

        const user = await UserRepository.findById(uid);
        const referral: IReferral = {
            owner: user,
            joinedUsers: [],
        };

        const savedReferral = await ReferralRepository.save(referral);
        return savedReferral._id.toHexString();
    }

    public static async getReferralInfoByUserId(uid: string): Promise<IReferralInfo> {
        const currentReferral = await ReferralRepository.findLatestByOwnerId(uid);
        const currentCount = await ReferralRepository.countJoinedUsersByOwner(uid);

        return {
            currentActiveCode: currentReferral ? currentReferral._id.toHexString() : '',
            ownerId: uid,
            totalUsersJoin: currentCount
        };
    }

    private static async assertCurrentRefferalExists(uid: string): Promise<void> {
        const currentReferral = await ReferralRepository.findLatestByOwnerId(uid);

        if (currentReferral) {
            throw new CurrentActiveReferralError();
        }
    }

}
