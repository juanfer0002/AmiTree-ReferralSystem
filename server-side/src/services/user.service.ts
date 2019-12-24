import { IUser } from '../model/user.model';
import UserRepository from '../repositories/user.repository';

class UserService {

    public static save(user: IUser): Promise<IUser> {
        return UserRepository.save(user);
    }

    public static findUserById(uid: string): Promise<IUser> {
        return UserRepository.findById(uid);
    }

}

export default UserService;
