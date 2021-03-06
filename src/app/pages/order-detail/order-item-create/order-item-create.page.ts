import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {Order} from '../../../models/order';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OrderService} from '../../../services/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderItem} from '../../../models/orderitem';
import {OrderItemService} from '../../../services/order-item.service';
import {CustomerService} from '../../../services/customer.service';
import {ProductService} from '../../../services/product.service';
import {BehaviorSubject, Observable, of, Subscription, zip} from 'rxjs';
import {Customer} from '../../../models/customer';
import {Product} from '../../../models/product';
import {ImageUploadService} from '../../../services/image-upload.service';
import {Status} from '../../../models/status.enum';
import {Color} from '../../../models/color.enum';
import {FontService} from '../../../services/font.service';
import {ColorService} from '../../../services/color.service';
import {StatusService} from '../../../services/status.service';
import {CustomerCacheService} from '../../../services/customer-cache.service';
import {ProductCacheService} from '../../../services/product-cache.service';
import {ToastService} from '../../../services/toast.service';
import {IonButton, IonInput} from '@ionic/angular';
import {ProductType} from '../../../models/product-type';
import {LoadingService} from '../../../services/loading.service';
import * as _ from 'lodash';
import {Page} from '../../../models/page';


@Component({
    selector: 'app-order-item-create',
    templateUrl: './order-item-create.page.html',
    styleUrls: ['./order-item-create.page.scss'],
})
export class OrderItemCreatePage implements OnInit, OnDestroy {
    subscription = new Subscription();
    orderItem: OrderItem;
    validationForm: FormGroup;
    orderId: string;
    order$: Observable<Order>;
    order: Order;
    customers$: Observable<Customer[]>;
    products$: Observable<Product[]>;
    oldImageUrl: string;
    statuses: (string | Status)[];
    colors: (string | Color)[];
    fontNames: string[];
    ringSizeUStoVNMapper: Map<number, number>;
    isCreated = false;
    isUpdated = false;
    isDetailed = false;
    orderItemWords: FormArray;
    orderItemFonts: FormArray;
    orderItemImageUrls: FormArray;
    imgFilesLists: FileList[] = [];

    constructor(private orderService: OrderService,
                private orderItemService: OrderItemService,
                private customerService: CustomerService,
                private productService: ProductService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                public imageUploadService: ImageUploadService,
                private fontService: FontService,
                private colorService: ColorService,
                private statusService: StatusService,
                private customerCacheService: CustomerCacheService,
                private productCacheService: ProductCacheService,
                private toastService: ToastService,
                private loadingService: LoadingService,
    ) {
    }

    async ngOnInit() {
        this.prepareAttributes();
        await this.preparePageContent();
    }

    @HostListener('unloaded')
    ngOnDestroy(): void {
        console.log('bye bye order item create ...');
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Prepare all Observables for the page
     */
    prepareAttributes() {
        this.statuses = this.statusService.getStatuses();
        this.colors = this.colorService.getColors();
        this.fontNames = this.fontService.getFontNames();
        this.ringSizeUStoVNMapper = this.mapRingSizeUStoVN();
        this.orderId = this.activatedRoute.snapshot.params.orderId;
        this.order$ = this.orderService.getOrder(this.orderId);
        this.customers$ = this.customerCacheService.getCustomersCache$();
        this.products$ = this.productCacheService.getProductsCache$();
    }

    /**
     * Identify what purpose of the page should be.
     * Create, Edit or Showing Detail of an Order Item
     */
    async preparePageContent() {
        const orderId = this.activatedRoute.snapshot.params.orderId;
        const orderItemId = this.activatedRoute.snapshot.params.orderItemId;
        const url = this.router.url.split('/');
        this.order$ = this.orderService.getOrder(orderId);


        switch (url[url.length - 1]) {
            case 'create':
                this.isCreated = true;
                try {
                    this.order$.subscribe(orderFromServer => {
                        this.order = orderFromServer;
                        this.orderItem = new OrderItem();
                        this.prepareFormValidationCreate();
                    });
                } catch (e) {
                    console.log(e);
                    await this.toastService.presentToastError(e.message);
                }

                break;
            case 'edit':
                try {
                    this.isUpdated = true;
                    this.subscription.add(this.orderItemService.getOrderItem(orderId, orderItemId).subscribe(orderItemFromServer => {
                        this.orderItem = orderItemFromServer;
                        this.prepareFormValidationUpdateOrDetail();
                    }));
                } catch (e) {
                    console.log(e);
                }
                break;
            default :
                try {
                    this.isDetailed = true;
                    this.subscription.add(this.orderItemService.getOrderItem(orderId, orderItemId).subscribe(orderItemFromServer => {
                        this.orderItem = orderItemFromServer;
                        this.prepareFormValidationUpdateOrDetail();
                    }));
                } catch (e) {
                    console.log(e);
                }
                break;
        }
    }

    /**
     * Prepare a Reactive Form for Creating an Order Item
     */
    prepareFormValidationCreate() {
        this.imgFilesLists = [];
        this.validationForm = this.formBuilder.group({
            order: new FormControl(this.order, Validators.required),
            orderItemCode: new FormControl('', Validators.required),
            orderItemStatus: new FormControl(Status.PENDING), // PENDING
            customer: new FormControl(''),
            product: new FormControl('', Validators.required),
            orderItemComment: new FormControl(''),
            orderItemQuantity: new FormControl(1, Validators.required),
            orderItemRingSizeUS: new FormControl({value: '', disabled: true}, [Validators.min(2), Validators.max(13), Validators.required]),
            orderItemLengthInch: new FormControl({value: '', disabled: true}, Validators.required),
            orderItemColor: new FormControl(Color.SILVER, Validators.required), // Color.SILVER
            orderItemFonts: new FormArray([new FormControl(this.fontNames[4], Validators.required)]), // Font Arial
            orderItemWords: new FormArray([new FormControl('')]),
            orderItemImageUrls: new FormArray([new FormControl('')])
        });

        this.orderItemFonts = this.validationForm.get('orderItemFonts') as FormArray;
        this.orderItemWords = this.validationForm.get('orderItemWords') as FormArray;
        this.orderItemImageUrls = this.validationForm.get('orderItemImageUrls') as FormArray;
    }

    addWordAndFontFormControl(wordValue: string = '', fontValue: string = this.fontNames[4]) {
        this.orderItemFonts.push(new FormControl(fontValue, Validators.required));
        this.orderItemWords.push(new FormControl(wordValue));
    }

    addImageUrlFormControl(imageUrlValue: string = '') {
        this.orderItemImageUrls.push(new FormControl(imageUrlValue));
    }

    previewLocalImg(files: FileList, imageIndex: number) {
        if (files.length === 0) {
            return;
        }

        const mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return this.toastService.presentToastError('Only images are supported.');
        }

        if (this.imgFilesLists.length > imageIndex) {
            this.imgFilesLists[imageIndex] = files;
        } else {
            this.imgFilesLists.push(files);
        }

        const reader = new FileReader();

        reader.readAsDataURL(files[0]);
        reader.onload = (progressEvent: ProgressEvent<FileReader>) => {
            const newImage = reader.result as string;
            const formImages = this.validationForm.value.orderItemImageUrls;
            formImages[imageIndex] = newImage;
            this.validationForm.patchValue({orderItemImageUrls: formImages});
        };
    }

    /**
     * Prepare a Reactive Form for Updating or Showing Detail of an Order Item
     */
    prepareFormValidationUpdateOrDetail() {
        this.imgFilesLists = [];
        this.validationForm = this.formBuilder.group({
            order: new FormControl(this.orderItem.order, Validators.required),
            orderItemCode: new FormControl(this.orderItem.orderItemCode, Validators.required),
            orderItemStatus: new FormControl(this.orderItem.orderItemStatus),
            customer: new FormControl(this.orderItem.customer),
            product: new FormControl(this.orderItem.product, Validators.required),
            orderItemComment: new FormControl(this.orderItem.orderItemComment),
            orderItemQuantity: new FormControl(this.orderItem.orderItemQuantity, Validators.required),
            orderItemRingSizeUS: new FormControl(this.orderItem.orderItemRingSizeUS, [Validators.min(2), Validators.max(13)]),
            orderItemLengthInch: new FormControl(this.orderItem.orderItemLengthInch),
            orderItemColor: new FormControl(this.orderItem.orderItemColor, Validators.required),
            orderItemFonts: new FormArray([]),
            orderItemWords: new FormArray([]),
            orderItemImageUrls: new FormArray([])
        });

        this.orderItemFonts = this.validationForm.get('orderItemFonts') as FormArray;
        this.orderItemWords = this.validationForm.get('orderItemWords') as FormArray;
        this.orderItemImageUrls = this.validationForm.get('orderItemImageUrls') as FormArray;
        this.configRingOrNecklace(this.validationForm.value.product);

        const words: string[] = this.orderItem.orderItemWords;
        const fonts: string[] = this.orderItem.orderItemFonts;
        if (words.length === 0) {
            this.addWordAndFontFormControl();
        } else {
            for (let i = 0; i < words.length; i++) {
                if (words[i].trim() !== '') {
                    this.addWordAndFontFormControl(words[i], fonts[i]);
                }
            }
        }

        const imageUrls: string[] = this.orderItem.orderItemImageUrls;
        if (imageUrls === undefined || imageUrls.length === 0) {
            this.addImageUrlFormControl();
        } else {
            imageUrls.forEach(imageUrl => {
                this.addImageUrlFormControl(imageUrl);
                this.imgFilesLists.push(undefined);
            });
        }
    }

    configRingOrNecklace(product: Product) {
        const ringSizeUSInput = this.validationForm.get('orderItemRingSizeUS');
        const lengthInchInput = this.validationForm.get('orderItemLengthInch');
        if (product !== undefined) {
            switch (product.productType?.toUpperCase()) {
                case ProductType.NHAN:
                    this.enableRingDisableNecklace(ringSizeUSInput, lengthInchInput);
                    break;
                case ProductType.DAY:
                case ProductType.VONG:
                    this.enableNecklaceDisableRing(lengthInchInput, ringSizeUSInput);
                    break;
                default:
                    this.disableNecklaceAndRing(ringSizeUSInput, lengthInchInput);
                    break;
            }
        } else {
            this.disableNecklaceAndRing(ringSizeUSInput, lengthInchInput);
        }
    }


    private disableNecklaceAndRing(ringSizeUSInput?: AbstractControl, lengthInchInput?: AbstractControl) {
        if (ringSizeUSInput && lengthInchInput) {
            ringSizeUSInput.reset();
            ringSizeUSInput.disable();

            lengthInchInput.reset();
            lengthInchInput.disable();
        } else {
            const ringSizeUSInput2 = this.validationForm.get('orderItemRingSizeUS');
            const lengthInchInput2 = this.validationForm.get('orderItemLengthInch');
            ringSizeUSInput2.reset();
            ringSizeUSInput2.disable();

            lengthInchInput2.reset();
            lengthInchInput2.disable();
        }

    }

    private enableNecklaceDisableRing(lengthInchInput: AbstractControl, ringSizeUSInput: AbstractControl) {
        lengthInchInput.enable();
        lengthInchInput.setValidators(Validators.required);

        ringSizeUSInput.reset();
        ringSizeUSInput.disable();
    }

    private enableRingDisableNecklace(ringSizeUSInput: AbstractControl, lengthInchInput: AbstractControl) {
        ringSizeUSInput.enable();
        ringSizeUSInput.setValidators([Validators.min(2), Validators.max(13), Validators.required]);

        lengthInchInput.reset();
        lengthInchInput.disable();
    }

    /**
     * Prepare Ring Size Converter from US to VN
     */
    mapRingSizeUStoVN() {
        const ringSizeUStoVN = new Map();
        ringSizeUStoVN.set(2, 1);
        ringSizeUStoVN.set(2.5, 2);
        ringSizeUStoVN.set(3, 3);
        ringSizeUStoVN.set(3.5, 5);
        ringSizeUStoVN.set(4, 6);
        ringSizeUStoVN.set(4.5, 7);
        ringSizeUStoVN.set(5, 9);
        ringSizeUStoVN.set(5.5, 10);
        ringSizeUStoVN.set(6, 12);
        ringSizeUStoVN.set(6.5, 13);
        ringSizeUStoVN.set(7, 14);
        ringSizeUStoVN.set(7.5, 15);
        ringSizeUStoVN.set(8, 17);
        ringSizeUStoVN.set(8.5, 18);
        ringSizeUStoVN.set(9, 19);
        ringSizeUStoVN.set(9.5, 20);
        ringSizeUStoVN.set(10, 22);
        ringSizeUStoVN.set(10.5, 23);
        ringSizeUStoVN.set(11, 24.5);
        ringSizeUStoVN.set(11.5, 25.5);
        ringSizeUStoVN.set(12, 27);
        ringSizeUStoVN.set(12.5, 28);
        ringSizeUStoVN.set(13, 29.5);
        return ringSizeUStoVN;
    }

    /**
     * Transfer data from Reactive From to Order Item Object
     */
    async transferDataFromFormToObject() {
        this.orderItem.order = this.validationForm.value.order;
        this.orderItem.orderItemCode = this.validationForm.value.orderItemCode;
        this.orderItem.orderItemStatus = this.validationForm.value.orderItemStatus;
        this.orderItem.customer = this.validationForm.value.customer;
        this.orderItem.product = this.validationForm.value.product;
        this.orderItem.orderItemComment = this.validationForm.value.orderItemComment;
        this.orderItem.orderItemQuantity = this.validationForm.value.orderItemQuantity;
        if (this.validationForm.value.orderItemRingSizeUS) {
            this.orderItem.orderItemRingSizeUS = this.validationForm.value.orderItemRingSizeUS;
            this.orderItem.orderItemRingSizeVN = this.ringSizeUStoVNMapper.get(this.orderItem.orderItemRingSizeUS);
        }
        if (this.validationForm.value.orderItemLengthInch) {
            this.orderItem.orderItemLengthInch = this.validationForm.value.orderItemLengthInch;
            this.orderItem.orderItemLengthCm = Number((this.orderItem.orderItemLengthInch * 2.54).toFixed(2));
        }
        this.orderItem.orderItemColor = this.validationForm.value.orderItemColor;

        const oldImageUrls: string[] = this.orderItem.orderItemImageUrls;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.imgFilesLists.length; i++) {
            switch (this.isCreated) {
                case true:
                    const imgUrl = await this.imageUploadService.uploadOrderItemImage(this.imgFilesLists[i]);
                    this.orderItem.orderItemImageUrls.push(imgUrl);
                    break;
                case false:
                    if (this.imgFilesLists[i] !== undefined) {
                        const newImgUrl = await this.imageUploadService.uploadOrderItemImage(this.imgFilesLists[i]);
                        if (i < this.orderItem.orderItemImageUrls.length) {
                            await this.imageUploadService.deleteImageFromUrl(oldImageUrls[i]);
                            this.orderItem.orderItemImageUrls[i] = newImgUrl;
                        } else {
                            this.orderItem.orderItemImageUrls.push(newImgUrl);
                        }
                    }
                    break;
            }
        }

        const words: string[] = this.validationForm.value.orderItemWords;
        const fonts: string[] = this.validationForm.value.orderItemFonts;
        for (let i = 0; i < words.length; i++) {
            if (i < this.orderItem.orderItemWords.length) {
                this.orderItem.orderItemWords[i] = words[i];
                this.orderItem.orderItemFonts[i] = fonts[i];
            } else {
                this.orderItem.orderItemWords.push(words[i]);
                this.orderItem.orderItemFonts.push(fonts[i]);
            }
        }
        for (let i = 0; i < words.length; i++) {
            if (this.orderItem.orderItemWords[i] === '') {
                this.orderItem.orderItemWords.splice(i, 1);
                this.orderItem.orderItemFonts.splice(i, 1);
            }
        }
    }

    /**
     * Handler Submit button
     */
    async submitHandler(submitButton: IonButton) {
        submitButton.disabled = true;
        await this.loadingService.presentLoading();
        await this.transferDataFromFormToObject();
        try {
            if (this.isCreated) {
                this.orderItem.createdAt = new Date();
                const result = await this.orderItemService.createOrderItem(this.orderId, this.orderItem);
                this.orderItem.id = result.id;
                await this.toastService.presentToastSuccess(`Successfully created Order Item ${this.orderItem.orderItemCode}`);
            } else {
                console.log(this.orderItem);
                await this.orderItemService.updateOrderItem(this.orderId, this.orderItem);
                await this.toastService.presentToastSuccess(`Successfully updated Order Item ${this.orderItem.orderItemCode}`);
            }

            await this.loadingService.dismissLoading();
            submitButton.disabled = false;
            await this.router.navigate(['orders', this.orderId, 'orderItems']);
            window.dispatchEvent(new Event('resize'));
        } catch (e) {
            console.log(e);
            await this.loadingService.dismissLoading();
            await this.toastService.presentToastError(e.message);
            submitButton.disabled = false;
        }
    }

    /**
     * Helper to select data for <ion-select>
     * @param o1: Object
     * @param o2: Object
     */
    compareWithFn(o1, o2) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }

    /**
     * Return css color class given Oder Item's color
     */
    getColorClass() {
        return this.colorService.getColorClass(this.validationForm.value.orderItemColor);
    }

    getFontClassFormArray(fontName: string) {
        return this.fontService.getFontClass(fontName);
    }


}
