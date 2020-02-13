export class Product {
    id?: string;
    productName: string;
    productType: string;
    cutOrEngraved: 'CUT' | 'ENGRAVED';
    imageUrl?: string;
    createdAt: Date;
}
