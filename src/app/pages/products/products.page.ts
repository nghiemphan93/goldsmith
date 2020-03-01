import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {forkJoin, Observable, of, pipe, range, Subscription} from 'rxjs';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {Product} from '../../models/product';
import {AlertController, Config, Platform} from '@ionic/angular';
import {ImageUploadService} from '../../services/image-upload.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy {
    productsDesktop$: Observable<Product[]>[] = [];
    productsMobile$: Observable<Product[]>[] = [];
    products: Product[] = [];
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;
    skeletons = [1, 2];

    constructor(private productService: ProductService,
                private imageUploadService: ImageUploadService,
                private config: Config,
                private platform: Platform,
                private alertController: AlertController
    ) {
    }

    ngOnInit() {
        this.preparePlatform();
        if (this.isDesktop) {
            this.productsDesktop$.push(this.productService.getLimitedProductsAfterStart());
            this.productsDesktop$[0].subscribe(moreProducts => {
                this.addPaginatedProducts(moreProducts);
            });
        } else {
            this.productsMobile$.push(this.productService.getLimitedProductsAfterStart());
        }
    }

    ngOnDestroy() {
        if (this.productService.isPageFullyLoaded()) {
            this.productService.setPageFullyLoaded(false);
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
                this.productsDesktop$.push(this.productService.getLimitedProductsAfterLastDoc());
                this.productsDesktop$[this.productsDesktop$.length - 1].subscribe(moreProducts => {
                    this.addPaginatedProducts(moreProducts);
                    event.target.complete();
                });
            }
        }
    }

    /**
     * Add new or updated Products to this.products based on product's index
     * @param moreProducts: Product[]
     */
    private addPaginatedProducts(moreProducts: Product[]) {
        if (moreProducts.length > 0) {
            const productIndex = this.products.findIndex(product => product.id === moreProducts[0].id);
            console.log('edited product: ' + productIndex);
            if (productIndex >= 0) {
                const products = [...this.products];
                products.splice(productIndex, moreProducts.length, ...moreProducts);
                this.products = products;
            } else {
                let products = [...this.products];
                products = [...products, ...moreProducts];
                this.products = [...products];
            }
        }
    }
}
