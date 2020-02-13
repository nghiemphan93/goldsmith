import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {MyData} from '../file-upload-demo/file-upload-demo.page';
import {Product} from '../../models/product';
import {Config, Platform} from '@ionic/angular';

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
    products: Observable<Product[]>;
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;

    constructor(private productService: ProductService,
                private config: Config,
                private platform: Platform
    ) {
    }

    ngOnInit() {
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');

        this.products = this.productService.getProducts();
    }


    open(row) {
        console.log(row);
    }

    deleteProduct(toDeleteProduct: Product) {
        console.log(toDeleteProduct);
        this.productService.deleteProduct(toDeleteProduct);
    }
}
