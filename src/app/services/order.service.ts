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
import {Customer} from '../models/customer';
import {Product} from '../models/product';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    orderCollection: AngularFirestoreCollection<Order>;
    orderDoc: AngularFirestoreDocument<Order>;
    orders: Observable<Order[]>;
    order: Observable<Order>;
    pageLimit = 10;
    lastDocSnapshot: QueryDocumentSnapshot<unknown>;
    pageFullyLoaded = false;

    constructor(private afs: AngularFirestore,
                private authService: AuthService
    ) {
        console.log('order service created...');
        this.orderCollection = this.afs.collection('orders', ref =>
            ref.orderBy('createdAt', 'desc'));
    }

    /**
     * Return all Orders from Database
     */
    getOrders(): Observable<Order[]> {
        this.orders = this.orderCollection.snapshotChanges().pipe(
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
            map(actions => actions.map(act => {
                const data = act.payload.doc.data() as Order;
                data.id = act.payload.doc.id;
                return data;
            }))
        );

        return this.orders;
    }

    /**
     * Return one Order from Database given orderId
     * @param orderId: string
     */
    getOrder(orderId: string): Observable<Order> {
        this.orderDoc = this.afs.doc<Order>(`orders/${orderId}`);
        this.order = this.orderDoc.snapshotChanges().pipe(
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
            map(action => {
                if (action.payload.exists === false) {
                    return null;
                } else {
                    const data = action.payload.data() as Order;
                    data.id = action.payload.id;
                    return data;
                }
            })
        );
        return this.order;
    }

    /**
     * Upload one new Order to Database
     * @param order: Order
     */
    async createOrder(order: Order): Promise<DocumentReference> {
        const data = JSON.parse(JSON.stringify(order));
        return await this.orderCollection.add(data);
    }

    /**
     * Update one Order to Database
     * @param toUpdateOrder: Order
     */
    async updateOrder(toUpdateOrder: Order) {
        this.orderDoc = this.afs.doc(`orders/${toUpdateOrder.id}`);
        return await this.orderDoc.update(toUpdateOrder);
    }

    /**
     * Delete one Order from Database
     * @param toDeleteOrder: Order
     */
    async deleteOrder(toDeleteOrder: Order) {
        this.orderDoc = this.afs.doc(`orders/${toDeleteOrder.id}`);
        return await this.orderDoc.delete();
    }

    /**
     * Return the first limited Orders from the top of the ordered result
     * Used for Pagination
     */
    getLimitedOrdersAfterStart(): Observable<Order[]> {
        this.orders = this.afs.collection('orders', ref =>
            ref
                .orderBy('createdAt', 'desc')
                .limit(this.pageLimit)).snapshotChanges().pipe(
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
            map(actions => {
                    try {
                        if (this.isPageFullyLoaded() === false) {
                            this.saveLastDocSnapshot(actions);
                        }
                        return actions.map(act => {
                            const data = act.payload.doc.data() as Order;
                            data.id = act.payload.doc.id;

                            return data;
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
            )
        );
        return this.orders;
    }

    /**
     * Return the next limited Orders from the last Query's Document Snapshot
     * Used for Pagination
     */
    getLimitedOrdersAfterLastDoc(): Observable<Order[]> {
        try {
            this.orders = this.afs.collection('orders', ref =>
                ref
                    .orderBy('createdAt', 'desc')
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
                                    const data = act.payload.doc.data() as Order;
                                    data.id = act.payload.doc.id;
                                    return data;
                                });
                            } catch (e) {
                                return [];
                            }
                        }
                    )
                );
            return this.orders;
        } catch (e) {
            console.log(e);
        }
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
            console.log(act.payload.doc.data().orderCode + ' from cache=' + act.payload.doc.metadata.fromCache + ' type=' + act.type);
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
