import AppError from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from "typeorm";
import User from '../typeorm/entities/User';
import { UserRepository } from '../typeorm/repositories/UsersRepository';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

class CreateSessionsService {
    public async execute({email, password}: IRequest): Promise<IResponse> { // IResponse
        const usersRepository = getCustomRepository(UserRepository);

        const user = await usersRepository.findByeEmail(email);

        if(!user) {
            throw new AppError("Incorrect email/password combination.", 401);
        }

        const passwordConfirmed = await compare(password, user.password);

        if(!passwordConfirmed) {
            throw new AppError("Incorrect email/password combination.", 401);
        }

        const token = sign({}, '116e8ea5429318ec4139e0778eb4c321', {
            subject: user.id,
            expiresIn: '1d',
        })

        return {
            user,
            token
        };
    }
}

export default CreateSessionsService;
