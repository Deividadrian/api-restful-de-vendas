import AppError from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
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

        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn,
        })

        return {
            user,
            token
        };
    }
}

export default CreateSessionsService;
