import {Component, OnInit} from '@angular/core';
import {Order} from '../../../models/order';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OrderService} from '../../../services/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderItem} from '../../../models/orderitem';
import {OrderItemService} from '../../../services/order-item.service';
import {CustomerService} from '../../../services/customer.service';
import {ProductService} from '../../../services/product.service';
import {Observable, of} from 'rxjs';
import {Customer} from '../../../models/customer';
import {Product} from '../../../models/product';
import {ImageUploadService} from '../../../services/image-upload.service';
import {Status} from '../../../models/status.enum';
import {HttpClient} from '@angular/common/http';
import {listFiles} from 'list-files-in-dir';
import {Color} from '../../../models/color.enum';
import {IonSelect} from '@ionic/angular';
import {take} from 'rxjs/operators';
import {FontService} from '../../../services/font.service';
import {ColorService} from '../../../services/color.service';


@Component({
    selector: 'app-order-item-create',
    templateUrl: './order-item-create.page.html',
    styleUrls: ['./order-item-create.page.scss'],
})
export class OrderItemCreatePage implements OnInit {
    newOrderItem: OrderItem = new OrderItem();
    validationForm: FormGroup;
    orderId: string;
    order: Observable<Order>;
    customers: Observable<Customer[]>;
    products: Observable<Product[]>;
    oldImageUrl: string;
    statuses: (string | Status)[] = Object.entries(Status).filter(e => !isNaN(e[0] as any)).map(e => e[1]);
    colors: (string | Color)[];
    fonts: string[];
    // selectedColorClass = 'silverColor';
    selectedColorStyle = {'background-color': 'white'};
    selectedFontStyle = {'font-family': 'Arial', 'font-size': '1rem'};
    ringSizeUStoVN: Map<number, number>;

    constructor(private orderService: OrderService,
                private orderItemService: OrderItemService,
                private customerService: CustomerService,
                private productService: ProductService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private imageUploadService: ImageUploadService,
                private fontService: FontService,
                private colorService: ColorService) {
    }

    async ngOnInit() {
        this.colors = this.colorService.getColors();
        this.fonts = this.fontService.getFontNames();
        this.ringSizeUStoVN = this.configRingSizeUStoVN();
        this.orderId = this.activatedRoute.snapshot.params.orderId;
        this.order = this.orderService.getOrder(this.orderId);
        this.customers = this.customerService.getCustomers();
        this.products = this.productService.getProducts();
        this.prepareFormValidation();

        // this.order.pipe(take(1)).subscribe(or => console.log(or));
    }

    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            order: new FormControl('', Validators.required),
            orderItemCode: new FormControl('', Validators.required),
            orderItemStatus: new FormControl(this.statuses[0]),
            customer: new FormControl(Validators.required),
            product: new FormControl('', Validators.required),
            orderItemComment: new FormControl(''),
            orderItemFont: new FormControl(this.fonts[4]),  // Font Arial
            orderItemWord: new FormControl(''),
            orderItemQuantity: new FormControl(1, Validators.required),
            orderItemRingSizeUS: new FormControl(''),
            orderItemLengthInch: new FormControl(''),
            orderItemColor: new FormControl(this.colors[0], Validators.required), // Color.SILVER
        });
    }

    async uploadProductImage(event: FileList) {
        try {
            this.newOrderItem.orderItemImageUrl = await this.imageUploadService.uploadProductImage(event);
            await this.imageUploadService.deleteImageFromUrl(this.oldImageUrl);
            this.oldImageUrl = this.newOrderItem.orderItemImageUrl;
        } catch (e) {
            console.log(e);
        }
    }

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

    async submitHandler() {
        this.newOrderItem.order = this.validationForm.value.order;
        this.newOrderItem.orderItemCode = this.validationForm.value.orderItemCode;
        this.newOrderItem.orderItemStatus = this.validationForm.value.orderItemStatus;
        this.newOrderItem.customer = this.validationForm.value.customer;
        this.newOrderItem.product = this.validationForm.value.product;
        this.newOrderItem.orderItemComment = this.validationForm.value.orderItemComment;
        this.newOrderItem.orderItemFont = this.validationForm.value.orderItemFont;
        this.newOrderItem.orderItemWord = this.validationForm.value.orderItemWord;
        this.newOrderItem.orderItemQuantity = this.validationForm.value.orderItemQuantity;

        if (this.validationForm.value.orderItemRingSizeUS) {
            this.newOrderItem.orderItemRingSizeUS = this.validationForm.value.orderItemRingSizeUS;
            this.newOrderItem.orderItemRingSizeVN = this.ringSizeUStoVN.get(this.newOrderItem.orderItemRingSizeUS);
        }
        if (this.validationForm.value.orderItemLengthInch) {
            this.newOrderItem.orderItemLengthInch = this.validationForm.value.orderItemLengthInch;
            this.newOrderItem.orderItemLengthCm = Number((this.newOrderItem.orderItemLengthInch * 2.54).toFixed(2));
        }


        this.newOrderItem.orderItemColor = this.validationForm.value.orderItemColor;
        this.newOrderItem.createdAt = new Date();

        try {
            const documentRef = await this.orderItemService.createOrderItem(this.orderId, this.newOrderItem);
            console.log(documentRef);
            await this.router.navigate(['orders', this.orderId, 'orderItems']);
        } catch (e) {
            console.log(e);
        }
        console.log(this.newOrderItem);
    }


    changeColor(orderItemColorElement: IonSelect) {
        this.selectedColorStyle = this.colorService.changeColor(orderItemColorElement);
    }

    changeFont(orderItemFontElement: IonSelect) {
        this.selectedFontStyle = this.fontService.changeFont(orderItemFontElement);
    }
}
