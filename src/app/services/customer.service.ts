import {Injectable} from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument, DocumentChangeAction,
    DocumentReference,
    QueryDocumentSnapshot
} from '@angular/fire/firestore';
import {Product} from '../models/product';
import {Observable} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Customer} from '../models/customer';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    customerCollection: AngularFirestoreCollection<Customer>;
    customerDoc: AngularFirestoreDocument<Customer>;
    customers$: Observable<Customer[]>;
    customer$: Observable<Customer>;
    pageLimit = 10;
    lastDocSnapshot: QueryDocumentSnapshot<unknown>;
    pageFullyLoaded = false;

    constructor(private afs: AngularFirestore,
                private authService: AuthService
    ) {
        console.log('customer service created...');
        this.customerCollection = this.afs.collection('customers', ref =>
            ref.orderBy('firstName', 'asc'));
    }

    /**
     * Return all Customers from Database
     */
    getCustomers(): Observable<Customer[]> {
        this.customers$ = this.customerCollection.snapshotChanges().pipe(
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
            map(actions => {
                console.log('-----------------------------------');
                actions.forEach(act => console.log(act.payload.doc.data().firstName + ' from cache=' + act.payload.doc.metadata.fromCache + ' type=' + act.payload.type));
                console.log('-----------------------------------');

                return actions.map(act => {
                    const data = act.payload.doc.data() as Customer;
                    data.id = act.payload.doc.id;
                    return data;
                });
            })
        );

        return this.customers$;
    }

    /**
     * Return one Product from Database given customerId
     * @param customerId: string
     */
    getCustomer(customerId: string): Observable<Customer> {
        this.customerDoc = this.afs.doc<Customer>(`customers/${customerId}`);
        this.customer$ = this.customerDoc.snapshotChanges().pipe(
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
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
        return this.customer$;
    }

    /**
     * Upload one new Customer to Database
     * @param customer: Customer
     */
    async createCustomer(customer: Customer): Promise<DocumentReference> {
        const data = JSON.parse(JSON.stringify(customer));
        return await this.customerCollection.add(data);
    }

    /**
     * Update one Customer to Database
     * @param toUpdateCustomer: Customer
     */
    async updateCustomer(toUpdateCustomer: Customer) {
        this.customerDoc = this.afs.doc(`customers/${toUpdateCustomer.id}`);
        return await this.customerDoc.update(toUpdateCustomer);
    }

    /**
     * Delete one Customer from Database
     * @param toDeleteCustomer: Customer
     */
    async deleteCustomer(toDeleteCustomer: Customer) {
        this.customerDoc = this.afs.doc(`customers/${toDeleteCustomer.id}`);
        return await this.customerDoc.delete();
    }

    /**
     * Return the first limited Customers from the top of the ordered result
     * Used for Pagination
     */
    getLimitedCustomersAfterStart(): Observable<Customer[]> {
        this.customers$ = this.afs.collection('customers', ref =>
            ref
                .orderBy('firstName', 'asc')
                .limit(this.pageLimit)).snapshotChanges().pipe(
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
            map(actions => {
                    try {
                        if (this.isPageFullyLoaded() === false) {
                            this.saveLastDocSnapshot(actions);
                        }
                        return actions.map(act => {
                            const data = act.payload.doc.data() as Customer;
                            data.id = act.payload.doc.id;

                            return data;
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
            )
        );
        return this.customers$;
    }

    /**
     * Return the next limited Customers from the last Query's Document Snapshot
     * Used for Pagination
     */
    getLimitedCustomersAfterLastDoc(): Observable<Customer[]> {
        this.customers$ = this.afs.collection('customers', ref =>
            ref
                .orderBy('firstName', 'asc')
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
                                const data = act.payload.doc.data() as Customer;
                                data.id = act.payload.doc.id;
                                return data;
                            });
                        } catch (e) {
                            return [];
                        }
                    }
                )
            );
        return this.customers$;
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
            console.log(act.payload.doc.data().firstName + ' from cache=' + act.payload.doc.metadata.fromCache + ' type=' + act.type);
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

