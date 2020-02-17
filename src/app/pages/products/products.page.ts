import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {Product} from '../../models/product';
import {Config, Platform} from '@ionic/angular';
import {ImageUploadService} from '../../services/image-upload.service';

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

    constructor(private productService: ProductService,
                private imageUploadService: ImageUploadService,
                private config: Config,
                private platform: Platform
    ) {
    }

    ngOnInit() {
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');

        this.products = this.productService.getProducts();
    }

    ngOnDestroy(): void {
    }


    open(row) {
        console.log(row);
    }

    deleteProduct(toDeleteProduct: Product) {
        console.log(toDeleteProduct);
        if (toDeleteProduct.imageUrl) {
            this.imageUploadService.deleteImageFromUrl(toDeleteProduct.imageUrl);
        }
        this.productService.deleteProduct(toDeleteProduct);
    }
}
