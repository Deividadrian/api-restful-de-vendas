import AppError from '@shared/errors/AppError';
import ProductRepository from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";

interface IResquest {
    id: string;
}

class DeleteProductService {
    public async execute({id}: IResquest): Promise<void> {
        const productsRepository = getCustomRepository(ProductRepository);

        const product = await productsRepository.findOne(id);

        if(!product) {
            throw new AppError('Product not found.')
        }

        await productsRepository.remove(product);
    }
}

export default DeleteProductService;
