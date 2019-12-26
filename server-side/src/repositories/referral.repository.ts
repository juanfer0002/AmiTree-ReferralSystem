import { ObjectId, ObjectID } from 'bson';
import Referral, { IReferral } from '../model/referral.model';

class ReferralRepository {

    public static async save(source: IReferral): Promise<IReferral> {
        let result: IReferral;

        if (source._id) {
            await Referral.updateOne({ _id: source._id }, source);
            result = await ReferralRepository.findById(source._id);
        } else {
            const account = new Referral(source);
            await account.save();
            result = account.toObject();
        }

        return result;
    }

    public static async findById(uid: string | ObjectId | ObjectID): Promise<IReferral> {
        const referral = await Referral.findById(uid).exec();
        return referral ? referral.toObject() : null;
    }

    public static async findLatestByOwnerId(uid: string | ObjectId | ObjectID): Promise<IReferral> {
        const referrals = await Referral.find({ owner: new ObjectId(uid), active: true })
            .sort({ date: -1 })
            .limit(1)
            .exec();

        return referrals.length > 0 ? referrals[0].toObject() : null;
    }

    public static async countJoinedUsersByOwner(uid: string | ObjectId | ObjectID): Promise<number> {
        const invoices = await Referral.find({ owner: new ObjectId(uid) })
            .exec();

        return 0; // TODO: implement
    }

}

export default ReferralRepository;
