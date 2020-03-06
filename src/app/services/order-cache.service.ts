import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class OrderCacheService {

    constructor() {
        console.log('order cache service created...');
    }
}
