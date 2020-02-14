import {Component, OnInit} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {finalize, tap} from 'rxjs/operators';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ImageUploadService} from '../../services/image-upload.service';
import {tryCatch} from 'rxjs/internal-compatibility';
import {Router} from '@angular/router';

@Component({
    selector: 'app-product-create',
    templateUrl: './product-create.page.html',
    styleUrls: ['./product-create.page.scss'],
})
export class ProductCreatePage implements OnInit {
    newProduct = new Product();
    validationForm: FormGroup;

    constructor(private productService: ProductService,
                private formBuilder: FormBuilder,
                private imageUploadService: ImageUploadService,
                private router: Router) {
    }

    ngOnInit() {
        this.prepareFormValidation();
    }

    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            productName: new FormControl('', Validators.required),
            productType: new FormControl('Dây', Validators.required),
            cutOrEngraved: new FormControl('Cut', Validators.required),
        });
    }

    async uploadProductImage(event: FileList) {
        this.newProduct.imageUrl = await this.imageUploadService.uploadProductImage(event);
    }

    async submitHandler() {
        this.newProduct.productName = this.validationForm.value.productName;
        this.newProduct.productType = this.validationForm.value.productType;
        this.newProduct.cutOrEngraved = this.validationForm.value.cutOrEngraved;
        this.newProduct.createdAt = new Date();

        try {
            const documentRef = await this.productService.createProduct(this.newProduct);
            console.log(documentRef);
            await this.router.navigate(['products']);
        } catch (error) {
            console.log(error);
        }

    }


}
