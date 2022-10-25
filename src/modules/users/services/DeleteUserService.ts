import AppError from '@shared/errors/AppError';
import { UserRepository } from '../typeorm/repositories/UsersRepository';
import { getCustomRepository } from "typeorm";

interface IResquest {
    id: string;
}

class DeleteUserService {
    public async execute({id}: IResquest): Promise<void> {
        const usersRepository = getCustomRepository(UserRepository);

        const user = await usersRepository.findOne(id);

        if(!user) {
            throw new AppError('user not found.')
        }

        await usersRepository.remove(user);
    }
}

export default DeleteUserService;
