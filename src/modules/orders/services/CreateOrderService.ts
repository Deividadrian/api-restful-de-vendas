import { ProductRepository } from './../../products/typeorm/repositories/ProductsRepository';
import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository, getRepository } from "typeorm";
import Order from '../typeorm/entities/Order';
import { OrdersRepository } from '../typeorm/repositories/OredrsRepository';

interface IProduct {
    id: string;
    quntity: number
}

interface IRequest {
    customer_id: string;
    products: IProduct[]
}

class CreateOrderService {
    public async execute({customer_id, products}: IRequest): Promise<Order> {
        const ordersRepository = getCustomRepository(OrdersRepository);
        const customersRepository = getCustomRepository(CustomersRepository);
        const productsRepository = getRepository(ProductRepository);

        const customersExists = await customersRepository.findById(customer_id);

        if(!customersExists) {
            throw new AppError('Could not find any customer with the given id');
        }

        const existsProducts = await productsRepository.findByIds(products);
    }
}

export default CreateOrderService;
