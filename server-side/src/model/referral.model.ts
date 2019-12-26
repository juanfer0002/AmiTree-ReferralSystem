import { ObjectID } from 'bson';
import { Document, model, Query, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface IReferral {
    _id?: ObjectID;
    date?: Date;
    owner: IUser;
    joinedUsers: IUser[];
    active?: boolean;
}

// To not expose mongo db functions trough interface
interface IReferralDocument extends IReferral, Document {
    _id: ObjectID;
}

const ReferralSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    joinedUsers: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    date: { type: Date },
    active: { type: Number, required: true, default: true },
});

ReferralSchema.pre('save', function (this: IReferralDocument, next) {
    this.date = new Date();
    next();
});

ReferralSchema.pre('updateOne', function (this: Query<IReferralDocument>, next) {
    const updateObj = this.getUpdate();
    delete updateObj.date;
    next();
});

const Referral = model<IReferralDocument>('referrals', ReferralSchema);
export default Referral;
