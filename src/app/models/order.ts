import {Status} from './status.enum';

export class Order {
    id: string;
    orderCode: string;
    orderStatus: Status;
    orderDeadline: Date;
    createdAt: Date;
}
