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
    productsDesktop$: Observable<Product[]>;
    productsMobile$: Observable<Product[]>[] = [];
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
            this.productsDesktop$ = this.productService.getProducts();
        } else {
            this.productsMobile$.push(this.productService.getLimitedProductsAfterStart());
        }
    }

    /**
     * Identify which platform is being used
     */
    private preparePlatform() {
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');
    }

    ngOnDestroy() {
        if (this.productService.isPageFullyLoaded()) {
            this.productService.setPageFullyLoaded(false);
        }
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
            this.productsMobile$.push(this.productService.getLimitedProductsAfterLastDoc());
            event.target.complete();
        }
    }
}
