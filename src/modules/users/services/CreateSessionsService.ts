import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { getCustomRepository } from "typeorm";
import User from '../typeorm/entities/User';
import { UserRepository } from '../typeorm/repositories/UsersRepository';

interface IRequest {
    email: string;
    password: string;
}

/* interface IResponse {
    user: User;
}*/

class CreateSessionsService {
    public async execute({email, password}: IRequest): Promise<User> { // IResponse
        const usersRepository = getCustomRepository(UserRepository);

        const user = await usersRepository.findByeEmail(email);

        if(!user) {
            throw new AppError("Incorrect email/password combination.", 401);
        }

        const passwordConfirmed = await compare(password, user.password);

        if(!passwordConfirmed) {
            throw new AppError("Incorrect email/password combination.", 401);
        }

        return user;
    }
}

export default CreateSessionsService;
