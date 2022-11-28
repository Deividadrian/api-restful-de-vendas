import ProductRepository from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from "typeorm";
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/RedisCache';

class ListProductService {
    public async execute(): Promise<Product[]> {
        const productsRepository = getCustomRepository(ProductRepository);

        const redisCache = new RedisCache();

        let products = await redisCache.recover<Product[]>('api-vendas-PRODUCT_LIST')

        if(!products) {
           products = await productsRepository.find();

           await redisCache.save('api-vendas-PRODUCT_LIST', products)
        }

        await redisCache.save('teste', 'teste');

        return products;
    }
}

export default ListProductService;
