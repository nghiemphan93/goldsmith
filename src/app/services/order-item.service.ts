import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference} from '@angular/fire/firestore';
import {Order} from '../models/order';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {OrderItem} from '../models/orderitem';

@Injectable({
    providedIn: 'root'
})
export class OrderItemService {
    constructor(private afs: AngularFirestore) {
    }

    getOrderItems(orderId: string): Observable<OrderItem[]> {
        const orderItems = this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems')
            .snapshotChanges().pipe(
                map(actions => actions.map(act => {
                    const data = act.payload.doc.data() as OrderItem;
                    data.id = act.payload.doc.id;
                    return data;
                }))
            );

        return orderItems;
    }

    getOrderItem(orderId: string, orderItemId: string): Observable<OrderItem> {
        const orderItem = this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems')
            .doc<OrderItem>(orderItemId)
            .snapshotChanges().pipe(
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

    createOrderItem(orderId: string, orderItem: OrderItem): Promise<DocumentReference> {
        const data = JSON.parse(JSON.stringify(orderItem));
        return this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems')
            .add(data);
    }

    updateOrderItem(orderId: string, toUpdateOrderItem: OrderItem) {
        return this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems')
            .doc<OrderItem>(toUpdateOrderItem.id)
            .update(toUpdateOrderItem);
    }

    deleteOrderItem(orderId: string, toDeleteOrderItem: OrderItem) {
        return this.afs
            .collection<Order>('orders')
            .doc<Order>(orderId)
            .collection<OrderItem>('orderItems')
            .doc<OrderItem>(toDeleteOrderItem.id)
            .delete();
    }
}
