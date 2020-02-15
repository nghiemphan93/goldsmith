import {Order} from './order';
import {Customer} from './customer';
import {Product} from './product';
import {Status} from './status.enum';
import {CoatedColor} from './color.enum';

export class OrderItem {
    id: string;
    // orderId: string;
    // customerId: string;
    // productId: string;

    order: Order;
    customer: Customer;
    product: Product;

    orderItemComment: string;
    orderItemCode: string;
    orderItemWord: string;
    orderItemImageUrl: string;
    orderItemQuantity: number;
    orderItemFont: string;
    orderItemColor: CoatedColor;
    orderItemRingSizeUS: number;
    orderItemRingSizeVN: number;
    orderItemLengthInch: number;
    orderItemLengthCm: number;
    orderItemStatus: Status;

    createdAt: Date;
}
