import {Injectable} from '@angular/core';
import {Order} from '../models/order';
import {BehaviorSubject, Observable} from 'rxjs';
import {OrderService} from './order.service';
import {AuthService} from './auth.service';
import {Product} from '../models/product';
import {ToastService} from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class OrderCacheService {
    ordersCache: Order[];
    ordersSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);

    constructor(private orderService: OrderService,
    ) {
        console.log('order cache service created...');
    }

    /**
     * Return an Observable stream of Orders
     * Check firstly from Cache, if not exists -> make another HTTP Call
     */
    getOrdersCache$(): Observable<Order[]> {
        if (this.ordersCache) {
            console.log('orders cache available...');
            return this.ordersSubject.asObservable();
        } else {
            console.log('make HTTP call to get Orders');
            try {
                this.orderService.getOrders()
                    .subscribe(ordersFromServer => {
                        this.ordersCache = ordersFromServer;
                        this.ordersSubject.next(this.ordersCache);
                    });
                return this.ordersSubject.asObservable();
            } catch (e) {
                console.log(e);
            }
        }
    }

    /**
     * Clear Orders Cache
     */
    clearOrdersCache(): void {
        this.ordersCache = [];
        this.ordersSubject.next(this.ordersCache);
    }

}
