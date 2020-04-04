import {Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
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
    isCreated: boolean;
    isUpdated: boolean;
    isDetailed: boolean;
    orderItemWords: FormArray;
    orderItemFonts: FormArray;
    orderItemImageUrls: FormArray;
    imgFilesLists: FileList[] = [];
    isRingSubject = new BehaviorSubject<boolean>(false);
    isRing$: Observable<boolean> = this.isRingSubject.asObservable();

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
                private loadingService: LoadingService
    ) {
    }

    async ngOnInit() {
        this.prepareAttributes();
        await this.preparePageContent();
    }

    ngOnDestroy(): void {
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
        this.ringSizeUStoVNMapper = this.configRingSizeUStoVN();
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
        this.validationForm = this.formBuilder.group({
            order: new FormControl(this.order, Validators.required),
            orderItemCode: new FormControl('', Validators.required),
            orderItemStatus: new FormControl(Status.PENDING), // PENDING
            customer: new FormControl('', Validators.required),
            product: new FormControl('', Validators.required),
            orderItemComment: new FormControl(''),
            orderItemQuantity: new FormControl(1, Validators.required),
            orderItemRingSizeUS: new FormControl({value: '', disabled: true}, [Validators.min(2), Validators.max(13)]),
            orderItemLengthInch: new FormControl({value: '', disabled: true}),
            orderItemColor: new FormControl(Color.SILVER, Validators.required), // Color.SILVER
            orderItemFonts: new FormArray([new FormControl(this.fontNames[4], Validators.required)]), // Font Arial
            orderItemWords: new FormArray([new FormControl('')]),
            orderItemImageUrls: new FormArray([new FormControl('')])
        });

        this.orderItemFonts = this.validationForm.get('orderItemFonts') as FormArray;
        this.orderItemWords = this.validationForm.get('orderItemWords') as FormArray;
        this.orderItemImageUrls = this.validationForm.get('orderItemImageUrls') as FormArray;
    }

    addWordAndFontFormControl() {
        this.orderItemFonts.push(new FormControl(this.fontNames[4], Validators.required));
        this.orderItemWords.push(new FormControl(''));
    }

    addImageUrlFormControl() {
        this.orderItemImageUrls.push(new FormControl(''));
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
        this.validationForm = this.formBuilder.group({
            order: new FormControl(this.orderItem.order, Validators.required),
            orderItemCode: new FormControl(this.orderItem.orderItemCode, Validators.required),
            orderItemStatus: new FormControl(this.orderItem.orderItemStatus),
            customer: new FormControl(this.orderItem.customer, Validators.required),
            product: new FormControl(this.orderItem.product, Validators.required),
            orderItemComment: new FormControl(this.orderItem.orderItemComment),
            orderItemQuantity: new FormControl(this.orderItem.orderItemQuantity, Validators.required),
            orderItemRingSizeUS: new FormControl(this.orderItem.orderItemRingSizeUS),
            orderItemLengthInch: new FormControl(this.orderItem.orderItemLengthInch),
            orderItemColor: new FormControl(this.orderItem.orderItemColor, Validators.required),
        });
    }

    configRingOrNecklace(product: Product) {
        if (product !== undefined) {
            const ringSizeUSInput = this.validationForm.get('orderItemRingSizeUS');
            const lengthInchInput = this.validationForm.get('orderItemLengthInch');

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
        }
    }


    private disableNecklaceAndRing(ringSizeUSInput: AbstractControl, lengthInchInput: AbstractControl) {
        ringSizeUSInput.reset();
        ringSizeUSInput.disable();

        lengthInchInput.reset();
        lengthInchInput.disable();
    }

    private enableNecklaceDisableRing(lengthInchInput: AbstractControl, ringSizeUSInput: AbstractControl) {
        lengthInchInput.enable();

        ringSizeUSInput.reset();
        ringSizeUSInput.disable();
    }

    private enableRingDisableNecklace(ringSizeUSInput: AbstractControl, lengthInchInput: AbstractControl) {
        ringSizeUSInput.enable();
        ringSizeUSInput.setValidators([Validators.min(2), Validators.max(13)]);

        lengthInchInput.reset();
        lengthInchInput.disable();
    }

    /**
     * Prepare Ring Size Converter from US to VN
     */
    configRingSizeUStoVN() {
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

        for (const filesList of this.imgFilesLists) {
            const imgUrl = await this.imageUploadService.uploadOrderItemImage(filesList);
            this.orderItem.orderItemImageUrls.push(imgUrl);
        }

        const words: string[] = this.validationForm.value.orderItemWords;
        const fonts: string[] = this.validationForm.value.orderItemFonts;
        for (let i = 0; i < words.length; i++) {
            if (words[i].trim() !== '') {
                this.orderItem.orderItemWords.push(words[i]);
                this.orderItem.orderItemFonts.push(fonts[i]);
            }
        }
    }

    /**
     * Handler Submit button
     */
    async submitHandler(submitButton: IonButton) {
        await this.loadingService.presentLoading();
        submitButton.disabled = true;
        await this.transferDataFromFormToObject();
        try {
            if (this.isCreated) {
                this.orderItem.createdAt = new Date();
                const result = await this.orderItemService.createOrderItem(this.orderId, this.orderItem);
                this.orderItem.id = result.id;
                await this.toastService.presentToastSuccess(`Successfully created Order Item ${this.orderItem.orderItemCode}`);
            } else {
                await this.orderItemService.updateOrderItem(this.orderId, this.orderItem);
                await this.toastService.presentToastSuccess(`Successfully updated Order Item ${this.orderItem.orderItemCode}`);
            }

            this.prepareFormValidationCreate();
            await this.loadingService.dismissLoading();
            await this.router.navigate(['orders', this.orderId, 'orderItems']);
            submitButton.disabled = false;
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

    /**
     * Return css font class given Oder Item's font
     */
    getFontClass() {
        return this.fontService.getFontClass(this.validationForm.value.orderItemFont);
    }

    getFontClassFormArray(fontName: string) {
        return this.fontService.getFontClass(fontName);
    }


}
