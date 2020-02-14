import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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

    toUpdateProduct: Product;
    oldImageUrl: string;
    validationForm: FormGroup;


    constructor(private productService: ProductService,
                private formBuilder: FormBuilder,
                private imageUploadService: ImageUploadService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    async ngOnInit() {
        const productId = this.activatedRoute.snapshot.params.productId;
        console.log(productId);
        try {
            this.productService.getProduct(productId).subscribe(productFromServer => {
                this.toUpdateProduct = productFromServer;
                console.log(this.toUpdateProduct);

                this.oldImageUrl = this.toUpdateProduct.imageUrl;
                this.prepareFormValidation();
            });

        } catch (e) {
            console.log(e);
        }
    }

    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            productName: new FormControl(this.toUpdateProduct.productName, Validators.required),
            productType: new FormControl(this.toUpdateProduct.productType, Validators.required),
            cutOrEngraved: new FormControl(this.toUpdateProduct.cutOrEngraved, Validators.required)
        });
    }

    async uploadProductImage(event: FileList) {
        try {
            this.toUpdateProduct.imageUrl = await this.imageUploadService.uploadProductImage(event);
            await this.imageUploadService.deleteProductImage(this.oldImageUrl);
            this.oldImageUrl = this.toUpdateProduct.imageUrl;
        } catch (e) {
            console.log(e);
        }
    }

    async submitHandler() {
        this.toUpdateProduct.productName = this.validationForm.value.productName;
        this.toUpdateProduct.productType = this.validationForm.value.productType;
        this.toUpdateProduct.cutOrEngraved = this.validationForm.value.cutOrEngraved;
        this.toUpdateProduct.createdAt = new Date();

        try {
            const documentRef = await this.productService.updateProduct(this.toUpdateProduct);
            console.log(documentRef);
            await this.router.navigate(['/products']);
        } catch (error) {
            console.log(error);
        }
    }

}
