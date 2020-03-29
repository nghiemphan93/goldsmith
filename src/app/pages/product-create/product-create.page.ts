import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable, Subscription} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {finalize, tap} from 'rxjs/operators';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ImageUploadService} from '../../services/image-upload.service';
import {tryCatch} from 'rxjs/internal-compatibility';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../../models/customer';
import {IonButton} from '@ionic/angular';
import {ToastService} from '../../services/toast.service';

@Component({
    selector: 'app-product-create',
    templateUrl: './product-create.page.html',
    styleUrls: ['./product-create.page.scss'],
})
export class ProductCreatePage implements OnInit, OnDestroy {
    subscription = new Subscription();
    product: Product;
    validationForm: FormGroup;
    oldImageUrl: string;
    isCreated: boolean;
    isUpdated: boolean;
    isDetailed: boolean;

    constructor(private productService: ProductService,
                private formBuilder: FormBuilder,
                private imageUploadService: ImageUploadService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.preparePageContent();
    }

    async ngOnDestroy() {
        console.log('bye bye ProductCreatePage...');
        if (this.oldImageUrl !== this.product.imageUrl && this.oldImageUrl !== null) {
            await this.imageUploadService.deleteImageFromUrl(this.oldImageUrl);
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Identify what purpose of the page should be.
     * Create, Edit or Detail of a Customer
     */
    preparePageContent() {
        const productId = this.activatedRoute.snapshot.params.productId;
        const url = this.router.url.split('/');


        switch (url[url.length - 1]) {
            case 'create':
                this.isCreated = true;
                this.product = new Product();
                this.prepareFormValidationCreate();
                break;
            case 'edit':
                try {
                    this.isUpdated = true;
                    this.subscription.add(this.productService.getProduct(productId).subscribe(productFromServer => {
                        this.product = productFromServer;
                        this.prepareFormValidationUpdateOrDetail();
                    }));
                } catch (e) {
                    console.log(e);
                }
                break;
            default :
                try {
                    this.isDetailed = true;
                    this.subscription.add(this.productService.getProduct(productId).subscribe(productFromServer => {
                        this.product = productFromServer;
                        this.prepareFormValidationUpdateOrDetail();
                    }));
                } catch (e) {
                    console.log(e);
                }
                break;
        }
    }

    /**
     * Prepare a Reactive Form for Creating a Product
     */
    prepareFormValidationCreate() {
        this.validationForm = this.formBuilder.group({
            productName: new FormControl('', Validators.required),
            productType: new FormControl('Dây', Validators.required),
            cutOrEngraved: new FormControl('Cut', Validators.required),
        });
    }

    /**
     * Prepare a Reactive Form for Editing or Showing Details of a Product
     */
    prepareFormValidationUpdateOrDetail() {
        this.validationForm = this.formBuilder.group({
            productName: new FormControl(this.product.productName, Validators.required),
            productType: new FormControl(this.product.productType, Validators.required),
            cutOrEngraved: new FormControl(this.product.cutOrEngraved, Validators.required)
        });
    }

    /**
     * Helper to upload Product's Image
     * @param event: FileList
     */
    async uploadProductImage(event: FileList) {
        try {
            if (this.oldImageUrl) {
                await this.imageUploadService.deleteImageFromUrl(this.oldImageUrl);
                this.oldImageUrl = this.product.imageUrl;
                this.product.imageUrl = await this.imageUploadService.uploadProductImage(event);
            } else {
                this.product.imageUrl = await this.imageUploadService.uploadProductImage(event);
                this.oldImageUrl = this.product.imageUrl;
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Handler Submit button
     */
    async submitHandler(submitButton: IonButton) {
        submitButton.disabled = true;

        this.product.productName = this.toTitleCase(this.validationForm.value.productName);
        this.product.productType = this.validationForm.value.productType;
        this.product.cutOrEngraved = this.validationForm.value.cutOrEngraved;

        try {
            if (this.isCreated) {
                this.product.createdAt = new Date();
                this.oldImageUrl = this.product.imageUrl;
                await this.productService.createProduct(this.product);
                await this.toastService.presentToastSuccess(`Created ${this.product.productName} successfully`);

            } else {
                this.oldImageUrl = this.product.imageUrl;
                await this.productService.updateProduct(this.product);
                await this.toastService.presentToastSuccess(`Updated ${this.product.productName} successfully`);
            }

            this.validationForm.reset({
                productType: 'Dây',
                cutOrEngraved: 'Cut'
            });
            await this.router.navigate(['products']);
            window.dispatchEvent(new Event('resize'));
        } catch (e) {
            console.log(e);
            await this.toastService.presentToastError(e.message);
            submitButton.disabled = false;
        }
    }

    /**
     * Helper function to transform a string to title case
     * @param s: any string
     */
    toTitleCase(s: string) {
        if (typeof s !== 'string') {
            return '';
        }
        return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
}
