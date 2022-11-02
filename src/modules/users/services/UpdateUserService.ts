import AppError from '@shared/errors/AppError';
import UserRepository from '../typeorm/repositories/UsersRepository';
import { getCustomRepository } from "typeorm";
import User from '../typeorm/entities/User';

interface IResquest {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string
}

class UpdateUserService {
    public async execute({id, name, email, password, avatar}: IResquest): Promise<User> {
        const usersRepository = getCustomRepository(UserRepository);

        const user = await usersRepository.findOne(id);

        if(!user) {
            throw new AppError('user not found.')
        }

        const usersExists = await usersRepository.findByName(name);

        if(usersExists && name != user.name) {
            throw new AppError('There is already one user with this name');
        }

        user.name = name;
        user.email = email;
        user.password = password;
        user.avatar = avatar;

        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserService;
