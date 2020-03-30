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
    orderItemFont: string;
    orderItemWord: string;
    orderItemWords: string[] = [];
    orderItemFonts: string[] = [];
    orderItemCode: string;
    orderItemImageUrl: string;
    orderItemImageUrls: string[] = [];
    orderItemQuantity: number;
    orderItemColor: Color;
    orderItemRingSizeUS: number;
    orderItemRingSizeVN: number;
    orderItemLengthInch: number;
    orderItemLengthCm: number;


    createdAt: Date;
}
