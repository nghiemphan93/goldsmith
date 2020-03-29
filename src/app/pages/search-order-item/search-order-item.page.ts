import {AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, fromEvent, observable, Observable, of, Subscription} from 'rxjs';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {AlertController, Config, IonInput, IonSelect, IonTextarea, Platform, ToastController} from '@ionic/angular';
import {OrderItemCacheService} from '../../services/order-item-cache.service';
import {OrderItem} from '../../models/orderitem';
import {Product} from '../../models/product';
import {HttpClient} from '@angular/common/http';
import {AgGridAngular} from 'ag-grid-angular';
import {FontService} from '../../services/font.service';
import {ColorService} from '../../services/color.service';
import {OrderItemService} from '../../services/order-item.service';
import {debounceTime, filter} from 'rxjs/operators';
import * as _ from 'lodash';
import {ToastService} from '../../services/toast.service';
import {AlertService} from '../../services/alert.service';
import {StatusService} from '../../services/status.service';
import {OrderCacheService} from '../../services/order-cache.service';
import {DatatableComponent} from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-search-order-item',
    templateUrl: './search-order-item.page.html',
    styleUrls: ['./search-order-item.page.scss'],
})
export class SearchOrderItemPage implements OnInit, OnDestroy {
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
    editingOrderItem = {};
    statuses = this.statusService.getStatuses();

    orderItems$: Observable<OrderItem[]>[] = [];
    orderItems: OrderItem[] = [];
    orderItemsSubject = new BehaviorSubject<OrderItem[]>([]);
    orderItemsFiltered: OrderItem[] = [];
    orderItemsFiltered$ = this.orderItemsSubject.asObservable();
    orderItemsPaginated: OrderItem[] = [];

    allOrderItemsCache$: Observable<OrderItem[]>;

    @ViewChild('searchInput') searchInput: IonInput;
    @ViewChild('orderItemCommentInput') orderItemCommentInput: ElementRef;
    @ViewChild('table') table: DatatableComponent;
    toSearchText = '';

    customActionSheetOptions: any = {
        header: 'Colors',
    };

    constructor(private orderService: OrderService,
                private config: Config,
                private platform: Platform,
                private formBuilder: FormBuilder,
                private orderItemCacheService: OrderItemCacheService,
                private fontService: FontService,
                private colorService: ColorService,
                private orderItemService: OrderItemService,
                private alertController: AlertController,
                private toastService: ToastService,
                public alertService: AlertService,
                private statusService: StatusService,
                private orderCacheService: OrderCacheService
    ) {
    }

    ngOnInit() {
        this.setup();
        this.orders$ = this.orderCacheService.getOrdersCache$();
        this.prepareFormValidation();
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

    onSelectOrder() {
        const selectedOrders = this.validationForm.value.orders;
        this.orderItemCacheService.setSelectedOrders(selectedOrders);

        // this.orderItemCacheService.getAllOrderItemsCache$().subscribe(orderItems => {
        //     orderItems.forEach(async orderItem => {
        //         const customer: any = orderItem.customer;
        //         const customerDetail = `${customer.firstName} ${customer.lastName}\n${customer.number} ${customer.street} \n${customer.city}, ${customer.state} ${customer.postal} \n${customer.country}`;
        //
        //         // console.log(customerDetail);
        //         // @ts-ignore
        //         orderItem.customer = customerDetail;
        //         console.log(orderItem);
        //
        //         // try {
        //         //     await this.orderItemService.updateOrderItem(orderItem.order.id, orderItem);
        //         //     await this.toastService.presentToastSuccess('Updated Order Item successfully...');
        //         // } catch (e) {
        //         //     console.log(e);
        //         //     await this.toastService.presentToastError(e.message);
        //         // }
        //
        //     });
        // });

        this.orderItemCacheService.getAllOrderItemsCache$().subscribe(moreOrderItems => {
            this.addMoreOrderItems(moreOrderItems);
            console.log(this.toSearchText);
            if (this.toSearchText === '') {
                console.log('new...');
                this.orderItemsFiltered = _.cloneDeep(this.orderItems); // Later for Filtering
                this.orderItemsPaginated = [];
                this.loadPaginatedData(null);
            } else {
                console.log('edited...');
                for (let i = 0; i < this.orderItemsPaginated.length; i++) {
                    for (const moreOrderItem of moreOrderItems) {
                        if (this.orderItemsPaginated[i].id === moreOrderItem.id) {
                            this.orderItemsPaginated[i] = moreOrderItem;
                        }
                    }
                }
                this.orderItemsPaginated = [...this.orderItemsPaginated];
            }
        });
    }

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
                this.orderItems = temp;
                console.log(this.orderItems);
            } else {
                console.log('added more Order Items');
                let temp = [];
                temp = [...this.orderItems, ...moreOrderItems];
                this.orderItems = temp;
                console.log(this.orderItems);
            }
        }
    }

    searchHandler() {
        this.toSearchText = this.validationForm.value.toSearchText.toLowerCase();
        console.log(this.toSearchText);

        if (this.orderItems.length > 0 && this.toSearchText !== '') {
            const filteredOrderItems = this.orderItems.filter(orderItem => JSON.stringify(orderItem).toLowerCase().includes(this.toSearchText));
            this.orderItemsFiltered = _.cloneDeep(filteredOrderItems);
            this.orderItemsPaginated = [];
            this.loadPaginatedData(null);
        } else {
            this.orderItemsFiltered = _.cloneDeep(this.orderItems);
            this.orderItemsPaginated = [];
            this.loadPaginatedData(null);
        }
    }

    /**
     * Triggered when content being scrolled 100px above the page's bottom to load for more Order Items
     * @param event: CustomerEvent
     */
    loadPaginatedData(event: any) {
        if (this.orderItemsFiltered.length > 10) {
            console.log('loaded more items');
            console.log(this.orderItemsFiltered);
            let orderItems = [...this.orderItemsPaginated];
            orderItems = [...orderItems, ...this.orderItemsFiltered.splice(0, 10)];
            this.orderItemsPaginated = [...orderItems];
            console.log(this.orderItemsFiltered);
        } else if (this.orderItemsFiltered.length > 0) {
            console.log('last 10 items');
            console.log(this.orderItemsFiltered);
            let orderItems = [...this.orderItemsPaginated];
            orderItems = [...orderItems, ...this.orderItemsFiltered.splice(0, this.orderItemsFiltered.length)];
            this.orderItemsPaginated = [...orderItems];
        }
        if (event) {
            event.target.complete();
        }
    }

    async updateOrderItem(event: Event, attributeName: string, rowIndex: number, toUpdateOrderItem: OrderItem) {
        this.editingOrderItem[rowIndex + '-' + attributeName] = false;
        if (toUpdateOrderItem[attributeName] !== event.target.value) {
            toUpdateOrderItem[attributeName] = event.target.value;
            try {
                const updateResult = await this.orderItemService.updateOrderItem(toUpdateOrderItem.order.id, toUpdateOrderItem);
                await this.toastService.presentToastSuccess(`Successfully updated Order Item ${toUpdateOrderItem.orderItemCode} from Order ${toUpdateOrderItem.order.orderCode}`);
            } catch (e) {
                console.log(e);
                await this.toastService.presentToastError(e.message);
            }
        }
    }

    startEditingInputText(inputElement: HTMLInputElement | HTMLTextAreaElement) {
        inputElement.focus();
    }

    async startEditingInputSelect(selectElement: IonSelect) {
        await selectElement.open();
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

    getColorClassCell({row, column, value}) {
        const className = row.orderItemColor.replace(/\s/g, '');
        const colorClass = {};
        colorClass[className] = true;
        return colorClass;
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
}
