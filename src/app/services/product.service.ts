import {Injectable} from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument, DocumentChangeAction,
    DocumentReference, DocumentSnapshot, QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import {Product} from '../models/product';
import {Observable, of} from 'rxjs';
import {filter, map, take, takeUntil} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    productCollection: AngularFirestoreCollection<Product>;
    productDoc: AngularFirestoreDocument<Product>;
    products: Observable<Product[]>;
    product: Observable<Product>;
    pageLimit = 10;
    lastDocSnapshot: QueryDocumentSnapshot<unknown>;
    pageFullyLoaded = false;

    constructor(private afs: AngularFirestore,
                private authService: AuthService
    ) {
        console.log('product service created...');
        this.productCollection = this.afs.collection('products', ref =>
            ref.orderBy('productName', 'asc'));
    }

    /**
     * Return all Products from Database
     */
    getProducts(): Observable<Product[]> {
        // Get Products with the ids
        this.products = this.productCollection.snapshotChanges().pipe(
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
            map(actions => {
                console.log('-----------------------------------');
                actions.forEach(act => console.log(act.payload.doc.data().productName + ' from cache=' + act.payload.doc.metadata.fromCache + ' type=' + act.payload.type));
                console.log('-----------------------------------');

                return actions.map(act => {
                    const data = act.payload.doc.data() as Product;
                    data.id = act.payload.doc.id;
                    return data;
                });
            })
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
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
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
    async createProduct(product: Product): Promise<DocumentReference> {
        const data = JSON.parse(JSON.stringify(product));
        return await this.productCollection.add(data);
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
        return await this.productDoc.delete();
    }

    /**
     * Return the first limited Products from the top of the ordered result
     * Used for Pagination
     */
    getLimitedProductsAfterStart(): Observable<Product[]> {
        this.products = this.afs.collection('products', ref =>
            ref
                .orderBy('productName', 'asc')
                .limit(this.pageLimit)).snapshotChanges().pipe(
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
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
     * Return the next limited Products from the last Query's Document Snapshot
     * Used for Pagination
     */
    getLimitedProductsAfterLastDoc(): Observable<Product[]> {
        this.products = this.afs.collection('products', ref =>
            ref
                .orderBy('productName', 'asc')
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
    private saveLastDocSnapshot(actions: DocumentChangeAction<unknown>[]): void {
        let isAdded = true;
        console.log('-----------------------------------');
        actions.forEach(act => {
            // @ts-ignore
            console.log(act.payload.doc.data().productName + ' from cache=' + act.payload.doc.metadata.fromCache + ' type=' + act.type);
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
     * Return if all data were fully loaded
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
