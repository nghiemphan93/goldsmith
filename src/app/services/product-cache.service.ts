import {Injectable} from '@angular/core';
import {Product} from '../models/product';
import {BehaviorSubject, Observable} from 'rxjs';
import {ProductService} from './product.service';

@Injectable({
    providedIn: 'root'
})
export class ProductCacheService {
    productsCache: Product[];
    productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);

    constructor(private productService: ProductService) {
    }

    /**
     * Return an Observable stream of Products
     * Check firstly from Cache, if not exists -> make another HTTP Call
     */
    getProductsCache(): Observable<Product[]> {
        if (this.productsCache) {
            console.log('products cache available...');
            return this.productsSubject.asObservable();
        } else {
            console.log('make HTTP call to get Products');
            this.productService.getProducts().subscribe(productsFromServer => {
                this.productsCache = productsFromServer;
                this.productsSubject.next(this.productsCache);
            });
            return this.productsSubject.asObservable();
        }
    }

    /**
     * Clear Products Cache
     */
    clearProductsCache(): void {
        this.productsCache = null;
    }
}
