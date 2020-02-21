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
    products: Observable<Product[]>;
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
        this.products = this.productService.getProducts();
    }

    /**
     * Identify which platform is being used
     */
    private preparePlatform() {
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');
    }

    ngOnDestroy(): void {
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
}
