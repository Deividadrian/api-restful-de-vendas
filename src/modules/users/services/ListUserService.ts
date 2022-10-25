import { UserRepository } from './../typeorm/repositories/UsersRepository';
import { getCustomRepository } from "typeorm";
import User from '../typeorm/entities/User';

class ListUserService {
    public async execute(): Promise<User[]> {
        const usersRepository = getCustomRepository(UserRepository);

        const users = usersRepository.find();

        return users;
    }
}

export default ListUserService;
