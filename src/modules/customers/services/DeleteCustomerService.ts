import AppError from '@shared/errors/AppError';
import { getCustomRepository } from "typeorm";
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IResquest {
    id: string;
}

class DeleteCustomerService {
    public async execute({id}: IResquest): Promise<void> {
        const customersRepository = getCustomRepository(CustomersRepository);

        const customer = await customersRepository.findOne(id);

        if(!customer) {
            throw new AppError('Product not found.')
        }

        await customersRepository.remove(customer);
    }
}

export default DeleteCustomerService;
