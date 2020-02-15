import {ProducingTechnic} from './producing-technic.enum';

export class Product {
    id?: string;
    productName: string;
    productType: string;
    cutOrEngraved: ProducingTechnic;
    imageUrl?: string;
    createdAt: Date;
}
