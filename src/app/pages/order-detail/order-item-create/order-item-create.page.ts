import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order} from '../../../models/order';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OrderService} from '../../../services/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderItem} from '../../../models/orderitem';
import {OrderItemService} from '../../../services/order-item.service';
import {CustomerService} from '../../../services/customer.service';
import {ProductService} from '../../../services/product.service';
import {Observable, of, Subscription} from 'rxjs';
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

    constructor(private orderService: OrderService,
                private orderItemService: OrderItemService,
                private customerService: CustomerService,
                private productService: ProductService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private imageUploadService: ImageUploadService,
                private fontService: FontService,
                private colorService: ColorService,
                private statusService: StatusService,
                private customerCacheService: CustomerCacheService,
                private productCacheService: ProductCacheService
    ) {
    }

    ngOnInit() {
        this.prepareAttributes();
        this.preparePageContent();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
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
    preparePageContent() {
        const orderId = this.activatedRoute.snapshot.params.orderId;
        const orderItemId = this.activatedRoute.snapshot.params.orderItemId;
        const url = this.router.url.split('/');
        this.order$ = this.orderService.getOrder(orderId);


        switch (url[url.length - 1]) {
            case 'create':
                this.isCreated = true;
                this.orderItem = new OrderItem();
                this.prepareFormValidationCreate();
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
            order: new FormControl(Validators.required),
            orderItemCode: new FormControl('', Validators.required),
            orderItemStatus: new FormControl(this.statuses[0]), // PENDING
            customer: new FormControl(Validators.required),
            product: new FormControl('', Validators.required),
            orderItemComment: new FormControl(''),
            orderItemFont: new FormControl(this.fontNames[4]),  // Font Arial
            orderItemWord: new FormControl(''),
            orderItemQuantity: new FormControl(1, Validators.required),
            orderItemRingSizeUS: new FormControl(''),
            orderItemLengthInch: new FormControl(''),
            orderItemColor: new FormControl(this.colors[0], Validators.required), // Color.SILVER
            orderItemImageUrl: new FormControl('')
        });
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
            orderItemFont: new FormControl(this.orderItem.orderItemFont),
            orderItemWord: new FormControl(this.orderItem.orderItemWord),
            orderItemQuantity: new FormControl(this.orderItem.orderItemQuantity, Validators.required),
            orderItemRingSizeUS: new FormControl(this.orderItem.orderItemRingSizeUS),
            orderItemLengthInch: new FormControl(this.orderItem.orderItemLengthInch),
            orderItemColor: new FormControl(this.orderItem.orderItemColor, Validators.required),
            orderItemImageUrl: new FormControl(this.orderItem.orderItemImageUrl)
        });
    }

    /**
     * Helper to upload Order Item's Image
     * @param event: FileList
     */
    async uploadOrderItemImage(event: FileList) {
        try {
            this.orderItem.orderItemImageUrl = await this.imageUploadService.uploadOrderItemImage(event);
            await this.imageUploadService.deleteImageFromUrl(this.oldImageUrl);
            this.oldImageUrl = this.orderItem.orderItemImageUrl;
        } catch (e) {
            console.log(e);
        }
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
    transferDataFromFormToObject() {
        this.orderItem.order = this.validationForm.value.order;
        this.orderItem.orderItemCode = this.validationForm.value.orderItemCode;
        this.orderItem.orderItemStatus = this.validationForm.value.orderItemStatus;
        this.orderItem.customer = this.validationForm.value.customer;
        this.orderItem.product = this.validationForm.value.product;
        this.orderItem.orderItemComment = this.validationForm.value.orderItemComment;
        this.orderItem.orderItemFont = this.validationForm.value.orderItemFont;
        this.orderItem.orderItemWord = this.validationForm.value.orderItemWord;
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
    }

    /**
     * Handler Submit button
     */
    async submitHandler() {
        this.transferDataFromFormToObject();

        try {
            if (this.isCreated) {
                this.orderItem.createdAt = new Date();
                const documentRef = await this.orderItemService.createOrderItem(this.orderId, this.orderItem);
                console.log(documentRef);
            } else {
                const documentRef = await this.orderItemService.updateOrderItem(this.orderId, this.orderItem);
                console.log(documentRef);
                console.log(this.orderItem);
            }
            this.validationForm.reset({
                orderItemStatus: this.statuses[0],  // PENDING
                orderItemFont: this.fontNames[4],   // ARIAL
                orderItemQuantity: 1,               // 1
                orderItemColor: this.colors[0]      // SILVER
            });
            await this.router.navigate(['orders', this.orderId, 'orderItems']);
            window.dispatchEvent(new Event('resize'));
        } catch (e) {
            console.log(e);
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
}
