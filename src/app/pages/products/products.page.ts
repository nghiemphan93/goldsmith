import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {Product} from '../../models/product';
import {AlertController, Config, Platform} from '@ionic/angular';
import {ImageUploadService} from '../../services/image-upload.service';
import {Customer} from '../../models/customer';

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

    ngOnDestroy(): void {
        if (this.productService.isFullyLoaded()) {
            this.productService.setFullyLoaded(false);
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
        this.productService.deleteProduct(toDeleteProduct);
    }

    /**
     * Triggered when content being scrolled 100px above the bottom to load for more Products
     * @param event: CustomerEvent
     */
    loadData(event: any) {
        const lastProduct$ = this.productService.getLimitedProductsAfterLastDoc();
        lastProduct$.subscribe(data => {
            if (this.productService.isFullyLoaded() === false) {
                this.productsMobile$.push(lastProduct$);
                if (data.length !== 0) {
                    // data.forEach(product => console.log(product.productName));
                    // console.log(this.productService.isFullyLoaded());
                    event.target.complete();
                } else {
                    this.productService.setFullyLoaded(true);
                    event.target.disabled = true;
                }
            }
        });
    }
}
