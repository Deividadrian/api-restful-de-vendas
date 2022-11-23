import AppError from '@shared/errors/AppError';
import ProductRepository from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";
import Product from '../typeorm/entities/Product';

interface IResquest {
    id: string;
}

class ShowProductService {
    public async execute({id}: IResquest): Promise<Product | undefined> {
        const productsRepository = getCustomRepository(ProductRepository);

        const product = await productsRepository.findOne(id);

        if(!product) {
            throw new AppError('Product not found.')
        }

        return product;
    }
}

export default ShowProductService;
