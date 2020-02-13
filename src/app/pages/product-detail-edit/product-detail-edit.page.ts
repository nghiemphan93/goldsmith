import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Product} from '../../models/product';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {ImageUploadService} from '../../services/image-upload.service';

@Component({
    selector: 'app-product-detail-edit',
    templateUrl: './product-detail-edit.page.html',
    styleUrls: ['./product-detail-edit.page.scss'],
})
export class ProductDetailEditPage implements OnInit {

    oldProduct: Product;
    updatedProduct: Product = new Product();
    validationForm: FormGroup;

    constructor(private productService: ProductService,
                private formBuilder: FormBuilder,
                private imageUploadService: ImageUploadService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        // @ts-ignore
        this.oldProduct = this.activatedRoute.snapshot.params;
        this.updatedProduct = this.copyProduct(this.oldProduct);
        console.log(this.oldProduct);

        this.prepareFormValidation();
    }

    copyProduct(toCopyProduct: Product): Product {
        const copiedProduct = new Product();
        copiedProduct.id = toCopyProduct.id;
        copiedProduct.productType = toCopyProduct.productType;
        copiedProduct.productName = toCopyProduct.productName;
        copiedProduct.createdAt = toCopyProduct.createdAt;
        copiedProduct.cutOrEngraved = toCopyProduct.cutOrEngraved;
        copiedProduct.imageUrl = toCopyProduct.imageUrl;
        return copiedProduct;
    }

    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            productName: new FormControl('', Validators.required),
            productType: new FormControl('Dây', Validators.required),
            cutOrEngraved: new FormControl('Cut', Validators.required),
            // imageUrl: new FormControl(Validators.required)
        });
    }

    async uploadProductImage(event: FileList) {
        this.updatedProduct.imageUrl = await this.imageUploadService.uploadProductImage(event);
    }

    async submitHandler() {
        this.oldProduct.productName = this.validationForm.value.productName;
        this.oldProduct.productType = this.validationForm.value.productType;
        this.oldProduct.cutOrEngraved = this.validationForm.value.cutOrEngraved;
        this.oldProduct.createdAt = new Date();

        try {
            const documentRef = await this.productService.createProduct(this.oldProduct);
            console.log(documentRef);
        } catch (error) {
            console.log(error);
        }

    }

}
