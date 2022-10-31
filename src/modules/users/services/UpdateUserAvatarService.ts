import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from "typeorm";
import User from '../typeorm/entities/User';
import { UserRepository } from '../typeorm/repositories/UsersRepository';
import uploadConfig from '@config/upload';

interface IRequest {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFilename}: IRequest): Promise<User> { // IResponse
        const usersRepository = getCustomRepository(UserRepository);

        const user = await usersRepository.findById(user_id);

        if(!user) {
            throw new AppError('User not foud.');
        }

        if(user.avatar) {
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
            const userAvatarFileExixts = await fs.promises.stat(userAvatarFilePath);

            if(userAvatarFileExixts) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        await usersRepository.save(user);

        return user;
    }

}

export default UpdateUserAvatarService;
