import {Injectable} from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument, DocumentChangeAction,
    DocumentReference, DocumentSnapshot, QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import {Product} from '../models/product';
import {Observable, of} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    productCollection: AngularFirestoreCollection<Product>;
    productDoc: AngularFirestoreDocument<Product>;
    products: Observable<Product[]>;
    product: Observable<Product>;
    pageLimit = 5;
    lastDocSnapshot: QueryDocumentSnapshot<unknown>;
    pageFullyLoaded = false;

    constructor(private afs: AngularFirestore) {
        this.productCollection = this.afs.collection('products', ref =>
            ref.orderBy('productName', 'asc'));
    }

    /**
     * Return all Products from Database
     */
    getProducts(): Observable<Product[]> {
        // Get Products with the ids
        this.products = this.productCollection.snapshotChanges().pipe(
            map(actions => actions.map(act => {
                const data = act.payload.doc.data() as Product;
                data.id = act.payload.doc.id;
                return data;
            }))
        );

        return this.products;
    }

    /**
     * Return one Product from Database given productId
     * @param productId: string
     */
    getProduct(productId: string): Observable<Product> {
        this.productDoc = this.afs.doc<Product>(`products/${productId}`);
        this.product = this.productDoc.snapshotChanges().pipe(
            map(action => {
                if (action.payload.exists === false) {
                    return null;
                } else {
                    const data = action.payload.data() as Product;
                    data.id = action.payload.id;
                    return data;
                }
            })
        );
        return this.product;
    }

    /**
     * Upload one new Product to Database
     * @param product: Product
     */
    createProduct(product: Product): Promise<DocumentReference> {
        const data = JSON.parse(JSON.stringify(product));
        return this.productCollection.add(data);
    }

    /**
     * Update one Product to Database
     * @param updatedProduct: Product
     */
    async updateProduct(updatedProduct: Product) {
        this.productDoc = this.afs.doc(`products/${updatedProduct.id}`);
        await this.productDoc.update(updatedProduct);
    }

    /**
     * Delete one Product from Database
     * @param toDeleteProduct: Product
     */
    async deleteProduct(toDeleteProduct: Product) {
        this.productDoc = this.afs.doc(`products/${toDeleteProduct.id}`);
        await this.productDoc.delete();
    }

    /**
     * Return the first 5 Products from the top of the ordered result
     */
    getLimitedProductsAfterStart(): Observable<Product[]> {
        this.products = this.afs.collection('products', ref =>
            ref
                .orderBy('productName', 'asc')
                .limit(this.pageLimit)).snapshotChanges().pipe(
            map(actions => {
                    try {
                        if (this.isPageFullyLoaded() === false) {
                            this.saveLastDocSnapshot(actions);
                        }
                        return actions.map(act => {
                            const data = act.payload.doc.data() as Product;
                            data.id = act.payload.doc.id;

                            return data;
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
            )
        );
        return this.products;
    }

    /**
     * Return the next 5 Products from the last Query's Document Snapshot
     */
    getLimitedProductsAfterLastDoc(): Observable<Product[]> {
        this.products = this.afs.collection('products', ref =>
            ref
                .orderBy('productName', 'asc')
                .limit(this.pageLimit)
                .startAfter(this.lastDocSnapshot))
            .snapshotChanges().pipe(
                map(actions => {
                        try {
                            if (actions.length === 0) {
                                this.setPageFullyLoaded(true);
                            }
                            if (this.isPageFullyLoaded() === false) {
                                this.saveLastDocSnapshot(actions);
                            }
                            return actions.map(act => {
                                const data = act.payload.doc.data() as Product;
                                data.id = act.payload.doc.id;
                                return data;
                            });
                        } catch (e) {
                            return [];
                        }
                    }
                )
            );
        return this.products;
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
            console.log(act.payload.doc.data().productName + ' ' + act.type);
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
