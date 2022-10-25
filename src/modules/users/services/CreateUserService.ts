import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { getCustomRepository } from "typeorm";
import User from '../typeorm/entities/User';
import { UserRepository } from '../typeorm/repositories/UsersRepository';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({name, email, password}: IRequest): Promise<User> {
        const usersRepository = getCustomRepository(UserRepository);

        const emailExists = await usersRepository.findByeEmail(email);

        if(emailExists) {
            throw new AppError("Email address already used.");
        }

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await usersRepository.save(user)

        return user;
    }
}

export default CreateUserService;
