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

    getOrderItemsCache$ByOrder(order: Order): Observable<OrderItem[]> {
        if (this.orderItemsMapCache.has(order.id)) {
            console.log(`order items cache from ${order.orderCode} available...`);
            return this.orderItemsMapSubjects.get(order.id).asObservable();
        } else {
            console.log(`make HTTP call to get Order Items for ${order.orderCode}`);
            this.orderItemsMapSubjects.set(order.id, new BehaviorSubject<OrderItem[]>([]));
            this.orderItemService.getOrderItems(order.id).subscribe(orderItems => {
                this.orderItemsMapCache.set(order.id, orderItems);
                this.orderItemsMapSubjects.get(order.id).next(orderItems);
            });
            return this.orderItemsMapSubjects.get(order.id).asObservable();
        }
    }

    getOrderItemsCache$(): Observable<OrderItem[]>[] {
        const observables: Observable<OrderItem[]>[] = [];
        this.selectedOrders.forEach(selectedOrder => {
            observables.push(this.getOrderItemsCache$ByOrder(selectedOrder));
        });

        return observables;
    }

    getAllOrderItemsCache$(): Observable<OrderItem[]> {
        const observables = this.getOrderItemsCache$();
        return merge(...observables);
    }
}
