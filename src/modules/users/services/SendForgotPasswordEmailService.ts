import AppError from '@shared/errors/AppError';
import { getCustomRepository } from "typeorm";
import path from 'path';
import UserRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import EtherealMail from '@config/email/EtherealMail';

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

        const {token} = await userTokensRepository.generate(user.id);

        const forgotPasswordTemplate = path.resolve(__dirname, '..','views','forgot_password.hbs')

        await EtherealMail.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[API Vendas] Recuperação de Senha',
            templateDate: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `http://localhost:3000/reset_password?token=${token}`, // Link para a aplicação front-end
                }
            },
        })
    }
}

export default SendForgotPasswordEmailService;
