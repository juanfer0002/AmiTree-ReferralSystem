import { ObjectID } from 'bson';
import { Document, model, Query, Schema } from 'mongoose';

export type UserType = 'main' | 'secondary';

export interface IUser {
    _id?: ObjectID;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    credit: number;
}

// To not expose mongo db functions trough interface
interface IUserDocument extends IUser, Document {
    _id: ObjectID;
}

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credit: { type: Number, required: true, default: true },
});

UserSchema.pre('save', function (this: IUserDocument, next) {
    this.email = this.email.toLowerCase();
    next();
});

UserSchema.pre('updateOne', function (this: Query<IUserDocument>, next) {
    const updateObj = this.getUpdate();
    if (updateObj.email) {
        updateObj.email = updateObj.email.toLowerCase();
    }

    updateObj.updateDate = new Date();
    next();
});

const User = model<IUserDocument>('users', UserSchema);
export default User;
