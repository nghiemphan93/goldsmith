import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference} from '@angular/fire/firestore';
import {Product} from '../models/product';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Customer} from '../models/customer';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    customerCollection: AngularFirestoreCollection<Customer>;
    customertDoc: AngularFirestoreDocument<Customer>;
    customers: Observable<Customer[]>;
    customer: Observable<Customer>;

    constructor(private afs: AngularFirestore) {
        this.customerCollection = this.afs.collection('customers', ref =>
            ref.orderBy('lastName', 'asc'));
    }

    getCustomers(): Observable<Customer[]> {
        this.customers = this.customerCollection.snapshotChanges().pipe(
            map(actions => actions.map(act => {
                const data = act.payload.doc.data() as Customer;
                data.id = act.payload.doc.id;
                return data;
            }))
        );

        return this.customers;
    }

    getCustomer(customerId: string): Observable<Customer> {
        this.customertDoc = this.afs.doc<Customer>(`customers/${customerId}`);
        this.customer = this.customertDoc.snapshotChanges().pipe(
            map(action => {
                if (action.payload.exists === false) {
                    return null;
                } else {
                    const data = action.payload.data() as Customer;
                    data.id = action.payload.id;
                    return data;
                }
            })
        );
        return this.customer;
    }

    createCustomer(customer: Customer): Promise<DocumentReference> {
        const data = JSON.parse(JSON.stringify(customer));
        return this.customerCollection.add(data);
    }

    updateCustomer(updatedCustomer: Customer) {
        this.customertDoc = this.afs.doc(`customers/${updatedCustomer.id}`);
        this.customertDoc.update(updatedCustomer);
    }

    deleteCustomer(toDeleteCustomer: Customer) {
        this.customertDoc = this.afs.doc(`customers/${toDeleteCustomer.id}`);
        this.customertDoc.delete();
    }
}

