import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class OrderItemCacheService {

    constructor() {
        console.log('order item cache service created...');
    }
}
