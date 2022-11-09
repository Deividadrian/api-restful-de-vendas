import AppError from '@shared/errors/AppError';
import { getCustomRepository } from "typeorm";
import UserRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
    email: string;
}

class SendForgotPasswordEmailService {
    public async execute({ email }: IRequest): Promise<void> {
        const usersRepository = getCustomRepository(UserRepository);
        const userTokensRepository = getCustomRepository(UserTokensRepository);

        const user = await usersRepository.findByeEmail(email);

        if(!user) {
            throw new AppError('User does not exists.')
        }

        const token = await userTokensRepository.generate(user.id);

        console.log(token);

    }
}

export default SendForgotPasswordEmailService;
