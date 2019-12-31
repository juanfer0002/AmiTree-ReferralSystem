import { ObjectId, ObjectID } from 'bson';
import User, { IUser } from '../model/user.model';

export class UserRepository {

    public static async save(source: IUser): Promise<IUser> {
        let result: IUser;

        if (source._id) {
            await User.updateOne({ _id: source._id }, source);
            result = await UserRepository.findById(source._id);
        } else {
            const account = new User(source);
            await account.save();
            result = account.toObject();
        }

        return result;
    }

    public static async findById(uid: string | ObjectId | ObjectID): Promise<IUser> {
        const user = await User.findById(uid).select('-password').exec();
        return user ? user.toObject() : null;
    }

    public static async findByEmailWithPassword(email: string): Promise<IUser> {
        const user = await User.findOne({ email: email.toLowerCase() }).exec();
        return user ? user.toObject() : null;
    }

    public static async findByEmail(email: string): Promise<IUser> {
        const user = await User.findOne({ email: email.toLowerCase() })
            .select('-password')
            .exec();
        return user ? user.toObject() : null;
    }

}
