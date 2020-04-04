import {Order} from './order';
import {Customer} from './customer';
import {Product} from './product';
import {Status} from './status.enum';
import {Color} from './color.enum';

export class OrderItem {
    id: string;

    order: Order;
    customer: string;
    product: Product;

    orderItemStatus: Status;
    orderItemComment: string;
    orderItemFonts: string[] = [];
    orderItemWords: string[] = [];
    orderItemCode: string;
    orderItemImageUrls: string[] = [];
    orderItemQuantity: number;
    orderItemColor: Color;
    orderItemRingSizeUS: number;
    orderItemRingSizeVN: number;
    orderItemLengthInch: number;
    orderItemLengthCm: number;


    createdAt: Date;
}
