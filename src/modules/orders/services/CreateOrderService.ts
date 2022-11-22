import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import ProductRepository from '@modules/products/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from "typeorm";
import Order from '../typeorm/entities/Order';
import OrdersRepository from '../typeorm/repositories/OredrsRepository';

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
        const productsRepository = getCustomRepository(ProductRepository);

        const customersExists = await customersRepository.findById(customer_id);

        if(!customersExists) {
            throw new AppError('Could not find any customer with the given id.');
        }

        const existsProducts = await productsRepository.findByIds(products);

        if(!existsProducts.length) {
            throw new AppError('Could not find any products with the given ids.');
        }

        const existsProductsIds = existsProducts.map(product => product.id);

        const checkInexixtentProduct = products.filter(
            product => !existsProductsIds.includes(product.id)
        );

        if(checkInexixtentProduct.length) {
            throw new AppError(`Could not find product ${checkInexixtentProduct[0].id}`);
        }

        const quantityAvailable = products.filter(
            product =>

              existsProducts.filter(p => p.id === product.id)[0].quantity <
            //@ts-ignore
              product.quantity,
          );

          if (quantityAvailable.length) {
            throw new AppError(
            //@ts-ignore
              `The quantity ${quantityAvailable[0].quantity}
               is not available for ${quantityAvailable[0].id}.`,
            );
          }

          const serializedProducts = products.map(product => ({
            product_id: product.id,
            //@ts-ignore
            quantity: product.quantity,
            //@ts-ignore
            price: existsProducts.filter(p => p.id === product.id)[0].price,
          }));

          const order = await ordersRepository.createOrder({
            //@ts-ignore
            customer: customerExists,
            products: serializedProducts,
          });

          const {order_products} = order

          const updatedProductQuantity = order_products.map(product => ({
            id: product.product_id,
            quantity:
            //@ts-ignore
              existsProducts.filter(p => p.id === product.id)[0].quantity -
              product.quantity,
          }));

          await productsRepository.save(updatedProductQuantity);

          return order;
    }
}

export default CreateOrderService;
