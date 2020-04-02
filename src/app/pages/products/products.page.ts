import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {forkJoin, Observable, of, pipe, range, Subscription} from 'rxjs';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {Product} from '../../models/product';
import {AlertController, Config, Platform} from '@ionic/angular';
import {ImageUploadService} from '../../services/image-upload.service';
import {AlertService} from '../../services/alert.service';
import {ProductCacheService} from '../../services/product-cache.service';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {ToastService} from '../../services/toast.service';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy {
    subscription = new Subscription();
    productsDesktop$: Observable<Product[]>;
    productsMobile$: Observable<Product[]>[] = [];
    products: Product[] = [];
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;
    skeletons = [1, 2];
    @ViewChild('table') table: DatatableComponent;
    user$ = this.authService.getCurentUser$();
    isAuth$ = this.authService.getIsAuth$();

    constructor(private productService: ProductService,
                private imageUploadService: ImageUploadService,
                private config: Config,
                private platform: Platform,
                private alertController: AlertController,
                public alertService: AlertService,
                private productCacheService: ProductCacheService,
                private toastService: ToastService,
                private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.preparePlatform();
        setTimeout(async () => {
            if (this.table.rowCount === 0) {
                this.table.rowCount = -1;
                await this.toastService.presentToastError('No data or Network error. Please add more data or refresh the page');
            }
        }, 4000);
    }

    ionViewDidEnter() {
        if (this.isDesktop) {
            this.productsDesktop$ = this.productCacheService.getProductsCache$();
        } else {
            this.productsMobile$.push(this.productService.getLimitedProductsAfterStart());
        }
    }

    ngOnDestroy() {
        console.log('bye bye ProductsPage...');
        if (this.productService.isPageFullyLoaded()) {
            this.productService.setPageFullyLoaded(false);
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Identify which platform is being used
     */
    private preparePlatform() {
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');
    }

    /**
     * Showing alert when clicking Delete Button
     * @param toDeleteProduct: Product
     */
    async presentDeleteConfirm(toDeleteProduct: Product) {
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: '<strong>Are you sure to delete?</strong>!!!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('canceled');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        console.log('okay');
                        this.deleteProduct(toDeleteProduct);
                    }
                }
            ]
        });

        await alert.present();
    }

    /**
     * Handler to delete a Product
     * @param toDeleteProduct: Product
     */
    async deleteProduct(toDeleteProduct: Product) {
        console.log(toDeleteProduct);
        if (toDeleteProduct.imageUrl) {
            await this.imageUploadService.deleteImageFromUrl(toDeleteProduct.imageUrl);
        }
        await this.productService.deleteProduct(toDeleteProduct);
    }

    /**
     * Triggered when content being scrolled 100px above the page's bottom to load for more Products
     * @param event: CustomerEvent
     */
    loadData(event: any) {
        if (this.productService.isPageFullyLoaded()) {
            event.target.disabled = true;
        } else {
            if (this.isMobile) {
                this.productsMobile$.push(this.productService.getLimitedProductsAfterLastDoc());
                event.target.complete();
            } else {
                // this.productsDesktop$.push(this.productService.getLimitedProductsAfterLastDoc());
                // this.subscription.add(this.productsDesktop$[this.productsDesktop$.length - 1].subscribe(moreProducts => {
                //     this.addPaginatedProducts(moreProducts);
                //     event.target.complete();
                // }));

                // this.productsDesktop$.push(this.productService.getLimitedProductsAfterLastDoc());
                // event.target.complete();

                // this.productsDesktop$.push(this.productService.getLimitedProductsAfterLastDoc());
                // this.productsDesktop$.forEach(products$ => {
                //     this.subscription.add(products$.subscribe(moreProducts => {
                //         console.log(moreProducts);
                //         event.target.complete();
                //     }));
                // });
            }
        }
    }

    /**
     * Add new or updated Products to this.products based on the first product's index
     * @param moreProducts: Product[]
     */
    private addPaginatedProducts(moreProducts: Product[]) {
        if (moreProducts.length > 0) {
            const productIndex = this.products.findIndex(product => product.id === moreProducts[0].id);
            if (productIndex >= 0) {
                console.log('edited product from block: ' + productIndex);
                const products = [...this.products];
                products.splice(productIndex, moreProducts.length, ...moreProducts);
                this.products = products;
            } else {
                console.log('loaded more products');
                let products = [...this.products];
                products = [...products, ...moreProducts];
                this.products = [...products];
            }
        }
    }
}
