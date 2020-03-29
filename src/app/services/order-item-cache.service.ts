import {Injectable} from '@angular/core';
import {Order} from '../models/order';
import {BehaviorSubject, concat, forkJoin, merge, Observable, of} from 'rxjs';
import {OrderItem} from '../models/orderitem';
import {OrderItemService} from './order-item.service';
import {Product} from '../models/product';
import {concatAll, mergeAll} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OrderItemCacheService {
    selectedOrders: Order[] = [];

    orderItemsMapSubjects = new Map<string, BehaviorSubject<OrderItem[]>>();
    orderItemsMapCache = new Map<string, OrderItem[]>();

    orderItemsCache: OrderItem[] = [];
    orderItemsSubject = new BehaviorSubject<OrderItem[]>([]);
    allOrderItems: OrderItem[] = [];

    constructor(private orderItemService: OrderItemService) {
        console.log('order item cache service created...');
    }

    init() {
        console.log('initializing cache order item...');
    }

    setSelectedOrders(selectedOrders: Order[]) {
        this.selectedOrders = selectedOrders;
    }

    getOrderItemsCache$ByOrder(orderId: string): Observable<OrderItem[]> {
        if (this.orderItemsMapCache.has(orderId)) {
            console.log(`order items cache from Order ${orderId} available...`);
            return this.orderItemsMapSubjects.get(orderId).asObservable();
        } else {
            console.log(`make HTTP call to get Order Items for Order ${orderId}`);
            this.orderItemsMapSubjects.set(orderId, new BehaviorSubject<OrderItem[]>([]));
            this.orderItemService.getOrderItems(orderId).subscribe(orderItems => {
                this.orderItemsMapSubjects.get(orderId).next(orderItems);
                this.orderItemsMapCache.set(orderId, orderItems);
            });
            return this.orderItemsMapSubjects.get(orderId).asObservable();
        }
    }

    getOrderItemsCache$(): Observable<OrderItem[]>[] {
        const observables: Observable<OrderItem[]>[] = [];
        this.selectedOrders.forEach(selectedOrder => {
            observables.push(this.getOrderItemsCache$ByOrder(selectedOrder.id));
        });
        return observables;
    }

    getAllOrderItemsCache$(): Observable<OrderItem[]> {
        const observables = this.getOrderItemsCache$();
        return merge(...observables);
    }
}
