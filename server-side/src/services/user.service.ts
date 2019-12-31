import { IUser } from '../model/user.model';
import { UserRepository } from '../repositories/user.repository';

export class UserService {

    public static findUserById(uid: string): Promise<IUser> {
        return UserRepository.findById(uid);
    }

}
