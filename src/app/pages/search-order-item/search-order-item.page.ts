import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, fromEvent, observable, Observable, of, Subscription} from 'rxjs';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {AlertController, Config, IonInput, Platform} from '@ionic/angular';
import {OrderItemCacheService} from '../../services/order-item-cache.service';
import {OrderItem} from '../../models/orderitem';
import {Product} from '../../models/product';
import {HttpClient} from '@angular/common/http';
import {AgGridAngular} from 'ag-grid-angular';
import {FontService} from '../../services/font.service';
import {ColorService} from '../../services/color.service';
import {OrderItemService} from '../../services/order-item.service';
import {debounceTime, filter} from 'rxjs/operators';

@Component({
    selector: 'app-search-order-item',
    templateUrl: './search-order-item.page.html',
    styleUrls: ['./search-order-item.page.scss'],
})
export class SearchOrderItemPage implements OnInit, OnDestroy, AfterViewInit {
    tableStyle = 'material';
    validationForm: FormGroup;
    ordersDesktop$: Observable<Order[]>;
    ordersMobile$: Observable<Order[]>[] = [];
    isDesktop: boolean;
    isMobile: boolean;
    skeletons = [1, 2];
    orders$: Observable<Order[]>;
    orders: Order[] = [];
    subscription = new Subscription();
    fontNames: string[];
    selectedOrders: Order[] = [];

    orderItems$: Observable<OrderItem[]>[] = [];
    orderItems: OrderItem[] = [];
    orderItemsSubject = new BehaviorSubject<OrderItem[]>([]);
    orderItemsTemp: OrderItem[] = [];
    orderItemsFiltered$ = this.orderItemsSubject.asObservable();

    allOrderItemsCache$: Observable<OrderItem[]>;

    @ViewChild('searchInput')
    searchInput: IonInput;

    constructor(private orderService: OrderService,
                private config: Config,
                private platform: Platform,
                private formBuilder: FormBuilder,
                private orderItemCacheService: OrderItemCacheService,
                private fontService: FontService,
                private colorService: ColorService,
                private orderItemService: OrderItemService,
                private alertController: AlertController
    ) {
    }

    ngOnInit() {
        this.setup();
        this.orders$ = this.orderService.getOrders();
        this.prepareFormValidation();

        this.subscription.add(this.orderItemCacheService.getAllOrderItemsCache$().subscribe(moreOrderItems => {
            this.addMoreOrderItems(moreOrderItems);
            this.orderItemsTemp = this.orderItems; // Later for Filtering
            this.orderItemsSubject.next(this.orderItems);
        }));
    }

    ngAfterViewInit(): void {
        // fromEvent(this.searchInput.debounce, 'keyup')
        //     .pipe(debounceTime(500))
        //     .subscribe((event) => this.searchHandler());
    }

    ngOnDestroy(): void {
        console.log('bye bye SearchOrderItemPage...');

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Identify which platform is being used
     */
    private setup() {
        this.fontNames = this.fontService.getFontNames();
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');
    }

    /**
     * Prepare a Reactive Form
     */
    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            orders: new FormControl('', Validators.required),
            toSearchText: new FormControl('')
        });
    }

    /**
     * Helper to select data for <ion-select>
     * @param o1: Object
     * @param o2: Object
     */
    compareWithFn(o1, o2) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }

    testHandler() {
        console.log(this.validationForm.value.order);
    }

    onSelectOrder() {
        const selectedOrders = this.validationForm.value.orders;
        this.orderItemCacheService.setSelectedOrders(selectedOrders);

        this.allOrderItemsCache$ = this.orderItemCacheService.getAllOrderItemsCache$();

        this.orderItemCacheService.getAllOrderItemsCache$().subscribe(orderItems => {
            this.addMoreOrderItems(orderItems);
            this.orderItemsTemp = this.orderItems; // Later for Filtering
            this.orderItemsSubject.next(this.orderItems);
        });
    }

    searchHandler() {
        const toSearchText = this.validationForm.value.toSearchText.toLowerCase();
        console.log(toSearchText);

        if (this.orderItems.length > 0 && toSearchText !== '') {
            const filteredOrderItems = this.orderItems.filter(orderItem => JSON.stringify(orderItem).toLowerCase().includes(toSearchText));
            // this.orderItemsSubject.next(temp);
            this.orderItemsTemp = filteredOrderItems;
        } else {
            // this.orderItemsSubject.next(this.orderItems);
            this.orderItemsTemp = this.orderItems;
        }
    }


    //  region Utilities
    /**
     * Add new or updated OrderItems to this.orderItems based on the first orderItem's index
     * @param moreOrderItems: OrderItem[]
     */
    private addMoreOrderItems(moreOrderItems: OrderItem[]) {
        if (moreOrderItems.length > 0) {
            const orderItemIndex = this.orderItems.findIndex(orderItem => orderItem.id === moreOrderItems[0].id);
            if (orderItemIndex >= 0) {
                console.log('edited OrderItems from block: ' + orderItemIndex);
                let temp = [...this.orderItems];
                temp = temp.filter(orderItem => orderItem.order.id !== moreOrderItems[0].order.id);
                temp.splice(orderItemIndex, 0, ...moreOrderItems);
                this.orderItems = [...temp];
            } else {
                console.log('added more Order Items');
                let temp = [...this.orderItems];
                temp = [...temp, ...moreOrderItems];
                this.orderItems = [...temp];
            }
        }
    }

    /**
     * Return css Color Class given Oder Item's color
     */
    getColorClass(orderItem: OrderItem) {
        return this.colorService.getColorClass(orderItem.orderItemColor);
    }

    /**
     * Return css Font Class given Oder Item's font
     */
    getFontClass(orderItem: OrderItem) {
        return this.fontService.getFontClass(orderItem.orderItemFont);
    }

    /**
     * Return css Ring Color Class for Table Cell
     * @param row: OrderItem
     * @param column: Column
     * @param value: string
     */
    getRingColorClassCell({row, column, value}) {
        if (row.orderItemRingSizeUS) {
            const className = row.orderItemColor.replace(/\s/g, '');

            const colorClass = {};
            colorClass[className] = true;
            return colorClass;
        }
    }

    /**
     * Return css Necklace Color Class for Table Cell
     * @param row: OrderItem
     * @param column: Column
     * @param value: string
     */
    getNecklaceColorClassCell({row, column, value}) {
        if (row.orderItemLengthInch) {
            const className = row.orderItemColor.replace(/\s/g, '');

            const colorClass = {};
            colorClass[className] = true;
            return colorClass;
        }
    }

    /**
     * Return css Quantity Class for Table Cell
     * @param row: OrderItem
     * @param column: Column
     * @param value: string
     */
    getQuantityClassCell({row, column, value}) {
        if (row.orderItemQuantity !== 1) {
            return {quantityGreaterThanOne: true};
        }
    }

    /**
     * Return css Comment Class for Table Cell
     * @param row: OrderItem
     * @param column: Column
     * @param value: string
     */
    getCommentClassCell({row, column, value}) {
        return {commentClass: true};
    }

    /**
     * Return css Font Class for Table Cell
     * @param row: OrderItem
     * @param column: Column
     * @param value: string
     */
    getFontClassCell({row, column, value}): any {
        let className = row.orderItemFont.replace(/\s/g, '');
        className = className.replace('.', '');
        const fontClass = {};
        fontClass[className] = true;
        return fontClass;
    }

    /**
     * Showing alert when clicking Delete Button
     * @param toDeleteOrderItem: Customer
     */
    async presentDeleteConfirm(toDeleteOrderItem: OrderItem) {
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: '<strong>Are you sure to delete?</strong>!!!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('canceled');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        console.log('okay');
                        this.deleteOrderItem(toDeleteOrderItem);
                    }
                }
            ]
        });
        await alert.present();
    }

    /**
     * Handler to delete an Order Item
     * @param toDeleteOrderItem: OrderItem
     */
    async deleteOrderItem(toDeleteOrderItem: OrderItem) {
        console.log(toDeleteOrderItem);
        try {
            await this.orderItemService.deleteOrderItem(toDeleteOrderItem.order.id, toDeleteOrderItem);
        } catch (e) {
            console.log(e);
        }
    }

    //  endregion
}
