import {Injectable} from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument, DocumentChangeAction,
    DocumentReference, QueryDocumentSnapshot
} from '@angular/fire/firestore';
import {Order} from '../models/order';
import {Observable} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {OrderItem} from '../models/orderitem';
import {AuthService} from './auth.service';


@Injectable({
    providedIn: 'root'
})
export class OrderItemService {
    pageLimit = 10;
    lastDocSnapshot: QueryDocumentSnapshot<unknown>;
    pageFullyLoaded = false;

    constructor(private afs: AngularFirestore,
                private authService: AuthService
    ) {
        console.log('order item service created...');
    }

    /**
     * Return all Order items from an Order
     * @param orderId: string
     */
    getOrderItems(orderId: string): Observable<OrderItem[]> {
        const orderItems = this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems', ref => ref.orderBy('createdAt'))
            .snapshotChanges().pipe(
                takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
                map(actions => {
                    console.log('-----------------------------------');
                    actions.forEach(act => console.log(act.payload.doc.data().orderItemCode + ' from cache=' + act.payload.doc.metadata.fromCache + ' type=' + act.payload.doc.metadata.fromCache));
                    console.log('-----------------------------------');

                    return actions.map(act => {
                        const data = act.payload.doc.data() as OrderItem;
                        data.id = act.payload.doc.id;
                        return data;
                    });
                })
            );

        return orderItems;
    }

    /**
     * Return an Order Item from an Order
     * @param orderId: string
     * @param orderItemId: string
     */
    getOrderItem(orderId: string, orderItemId: string): Observable<OrderItem> {
        const orderItem = this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems')
            .doc<OrderItem>(orderItemId)
            .snapshotChanges().pipe(
                takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
                map(action => {
                    if (action.payload.exists === false) {
                        return null;
                    } else {
                        const data = action.payload.data() as OrderItem;
                        data.id = action.payload.id;
                        return data;
                    }
                })
            );
        return orderItem;
    }

    /**
     * Upload one new Order Item for an Order
     * @param orderId: string
     * @param orderItem: OrderItem
     */
    async createOrderItem(orderId: string, orderItem: OrderItem): Promise<DocumentReference> {
        return await this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems')
            .add({...orderItem});
    }

    /**
     * Update an Order Item from an Order
     * @param orderId: string
     * @param toUpdateOrderItem: OrderItem
     */
    async updateOrderItem(orderId: string, toUpdateOrderItem: OrderItem) {
        return await this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems')
            .doc<OrderItem>(toUpdateOrderItem.id)
            .update({...toUpdateOrderItem});
    }

    /**
     * Delete an Order Item from an Order
     * @param orderId: string
     * @param toDeleteOrderItem: OrderItem
     */
    async deleteOrderItem(orderId: string, toDeleteOrderItem: OrderItem) {
        return await this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems')
            .doc<OrderItem>(toDeleteOrderItem.id)
            .delete();
    }


    /**
     * Return the first limited Order Items from an Order
     * Used for Pagination
     */
    getLimitedOrderItemsAfterStart(orderId: string): Observable<OrderItem[]> {
        const orderItems = this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems', ref =>
                ref
                    .orderBy('createdAt')
                    .limit(this.pageLimit))
            .snapshotChanges().pipe(
                takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
                map(actions => {
                        try {
                            if (this.isPageFullyLoaded() === false) {
                                this.saveLastDocSnapshot(actions);
                            }
                            return actions.map(act => {

                                const data = act.payload.doc.data() as OrderItem;
                                data.id = act.payload.doc.id;
                                return data;
                            });
                        } catch (e) {
                            console.log(e);
                            return [];
                        }
                    }
                )
            );
        return orderItems;
    }

    /**
     * Return the next limited Order Items from the last Query's Document Snapshot of an Order
     * Used for Pagination
     */
    getLimitedOrderItemsAfterLastDoc(orderId: string): Observable<OrderItem[]> {
        const orderItems = this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems', ref =>
                ref
                    .orderBy('createdAt')
                    .limit(this.pageLimit)
                    .startAfter(this.lastDocSnapshot))
            .snapshotChanges().pipe(
                takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
                map(actions => {
                        try {
                            if (actions.length === 0) {
                                this.setPageFullyLoaded(true);
                            }
                            if (this.isPageFullyLoaded() === false) {
                                this.saveLastDocSnapshot(actions);
                            }
                            return actions.map(act => {
                                const data = act.payload.doc.data() as OrderItem;
                                data.id = act.payload.doc.id;
                                return data;
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                )
            );
        return orderItems;
    }

    /**
     * Helper to save the last Document Snapshot
     * @param actions: DocumentChangeAction<any>[]
     */
    private saveLastDocSnapshot(actions: DocumentChangeAction<unknown>[]) {
        let isAdded = true;
        console.log('-----------------------------------');
        actions.forEach(act => {
            // @ts-ignore
            console.log(act.payload.doc.data().orderItemCode + ' from cache=' + act.payload.doc.metadata.fromCache + ' type=' + act.type);
            if (act.type !== 'added') {
                isAdded = false;
                return;
            }
        });
        console.log(isAdded);
        console.log('-----------------------------------');
        if (isAdded) {
            this.lastDocSnapshot = actions[actions.length - 1].payload.doc; // Remember last Document Snapshot
        }
    }

    /**
     * If all data were fully loaded
     */
    isPageFullyLoaded() {
        return this.pageFullyLoaded;
    }

    /**
     * Set page's state if data fully loaded
     * @param isPageFullyLoaded: boolean
     */
    setPageFullyLoaded(isPageFullyLoaded: boolean) {
        this.pageFullyLoaded = isPageFullyLoaded;
    }
}
