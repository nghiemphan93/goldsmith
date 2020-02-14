import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference} from '@angular/fire/firestore';
import {Order} from '../models/order';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Customer} from '../models/customer';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    orderCollection: AngularFirestoreCollection<Order>;
    orderDoc: AngularFirestoreDocument<Order>;
    orders: Observable<Order[]>;
    order: Observable<Order>;

    constructor(private afs: AngularFirestore) {
        this.orderCollection = this.afs.collection('orders', ref =>
            ref.orderBy('createdAt', 'desc'));
    }

    getOrders(): Observable<Order[]> {
        this.orders = this.orderCollection.snapshotChanges().pipe(
            map(actions => actions.map(act => {
                const data = act.payload.doc.data() as Order;
                data.id = act.payload.doc.id;
                return data;
            }))
        );

        return this.orders;
    }

    getOrder(orderId: string): Observable<Order> {
        this.orderDoc = this.afs.doc<Order>(`orders/${orderId}`);
        this.order = this.orderDoc.snapshotChanges().pipe(
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

    createOrder(order: Order): Promise<DocumentReference> {
        const data = JSON.parse(JSON.stringify(order));
        return this.orderCollection.add(data);
    }

    updateOrder(toUpdateOrder: Order) {
        this.orderDoc = this.afs.doc(`orders/${toUpdateOrder.id}`);
        return this.orderDoc.update(toUpdateOrder);
    }

    deleteOrder(toDeleteOrder: Order) {
        this.orderDoc = this.afs.doc(`orders/${toDeleteOrder.id}`);
        return this.orderDoc.delete();
    }
}
