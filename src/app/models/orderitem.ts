import {Order} from './order';
import {Customer} from './customer';
import {Product} from './product';
import {Status} from './status.enum';
import {Color} from './color.enum';

export class OrderItem {
    id: string;

    order: Order;
    customer: Customer;
    product: Product;

    orderItemComment: string;
    orderItemCode: string;
    orderItemWord: string;
    orderItemImageUrl: string;
    orderItemQuantity: number;
    orderItemFont: string;
    orderItemColor: Color;
    orderItemRingSizeUS: number;
    orderItemRingSizeVN: number;
    orderItemLengthInch: number;
    orderItemLengthCm: number;
    orderItemStatus: Status;

    createdAt: Date;
}
