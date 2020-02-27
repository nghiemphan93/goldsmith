import {Injectable} from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    DocumentReference, DocumentSnapshot,
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
    lastDocSnapshot: any;
    fullyLoaded = false;

    constructor(private afs: AngularFirestore) {
        this.productCollection = this.afs.collection('products', ref =>
            ref.orderBy('productName', 'asc'));
    }

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

    createProduct(product: Product): Promise<DocumentReference> {
        const data = JSON.parse(JSON.stringify(product));
        return this.productCollection.add(data);
    }

    updateProduct(updatedProduct: Product) {
        this.productDoc = this.afs.doc(`products/${updatedProduct.id}`);
        this.productDoc.update(updatedProduct);
    }

    deleteProduct(toDeleteProduct: Product) {
        this.productDoc = this.afs.doc(`products/${toDeleteProduct.id}`);
        this.productDoc.delete();
    }

    getLimitedProductsAfterStart(): Observable<Product[]> {
        this.products = this.afs.collection('products', ref =>
            ref
                .orderBy('productName', 'asc')
                .limit(this.pageLimit)).snapshotChanges().pipe(
            map(actions => {
                    try {
                        if (this.isFullyLoaded() === false) {
                            this.lastDocSnapshot = actions[actions.length - 1].payload.doc; // Remember last document snapshot
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
            , take(1));
        return this.products;
    }

    getLimitedProductsAfterLastDoc() {
        this.products = this.afs.collection('products', ref =>
            ref
                .orderBy('productName', 'asc')
                .limit(this.pageLimit)
                .startAfter(this.lastDocSnapshot)
        )
            .snapshotChanges().pipe(
                map(actions => {
                        try {
                            if (this.isFullyLoaded() === false) {
                                this.lastDocSnapshot = actions[actions.length - 1].payload.doc; // Remember last document snapshot
                            }
                            return actions.map(act => {
                                const data = act.payload.doc.data() as Product;
                                data.id = act.payload.doc.id;
                                return data;
                            });
                        } catch (e) {
                            return [];      // Cannot read property 'payload' of undefined
                        }
                    }
                )
                , take(1));
        return this.products;
    }

    getLimitedProductsAfterName(product: Product): Observable<Product[]> {
        this.products = this.afs.collection('products', ref =>
            ref
                .orderBy('productName', 'asc')
                .where('productName', '>', product.productName)
                .limit(this.pageLimit)
        )
            .snapshotChanges().pipe(
                map(actions => actions.map(act => {
                    const data = act.payload.doc.data() as Product;
                    data.id = act.payload.doc.id;
                    return data;
                }))
                , take(1));

        return this.products;
    }

    isFullyLoaded() {
        return this.fullyLoaded;
    }

    setFullyLoaded(isFullyLoaded: boolean) {
        this.fullyLoaded = isFullyLoaded;
    }
}
