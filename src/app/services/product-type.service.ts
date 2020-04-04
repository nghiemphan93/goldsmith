import {Injectable} from '@angular/core';
import {Status} from '../models/status.enum';
import {ProductType} from '../models/product-type';

@Injectable({
    providedIn: 'root'
})
export class ProductTypeService {
    productTypes: (string | ProductType)[] = Object.entries(ProductType).map(e => e[1]);

    constructor() {
    }

    getProductTypes(): (string | ProductType)[] {
        return this.productTypes;
    }
}
