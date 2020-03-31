import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OrderItemService} from '../../../services/order-item.service';
import {Observable, Subscription} from 'rxjs';
import {Order} from '../../../models/order';
import {OrderService} from '../../../services/order.service';
import {AlertController, Config, IonInput, IonSelect, IonTextarea, Platform} from '@ionic/angular';
import {OrderItem} from '../../../models/orderitem';
import {ActivatedRoute} from '@angular/router';
import {FontService} from '../../../services/font.service';
import {ColorService} from '../../../services/color.service';
import {take} from 'rxjs/operators';
import {Customer} from '../../../models/customer';
import {Product} from '../../../models/product';
import {AlertService} from '../../../services/alert.service';
import {OrderItemCacheService} from '../../../services/order-item-cache.service';
import * as _ from 'lodash';
import {ToastService} from '../../../services/toast.service';
import {StatusService} from '../../../services/status.service';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {AuthService} from '../../../services/auth.service';
import {Status} from '../../../models/status.enum';


@Component({
    selector: 'app-order-items',
    templateUrl: './order-items.page.html',
    styleUrls: ['./order-items.page.scss'],
})
export class OrderItemsPage implements OnInit, OnDestroy, AfterViewInit {
    subscription = new Subscription();
    orderItemsDesktop$: Observable<OrderItem[]>;
    orderItemsMobile$: Observable<OrderItem[]>[] = [];
    orderItems: OrderItem[] = [];
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;
    orderId: string;
    order: Observable<Order>;
    fontNames: string[];
    skeletons = [1, 2];
    editingOrderItem = {};
    customActionSheetOptions: any = {
        header: 'Status',
    };
    statuses = this.statusService.getStatuses();
    @ViewChild('table') table: DatatableComponent;
    user$ = this.authService.getCurentUser$();

    constructor(private orderItemService: OrderItemService,
                private orderService: OrderService,
                private config: Config,
                private platform: Platform,
                private activatedRoute: ActivatedRoute,
                private fontService: FontService,
                private colorService: ColorService,
                private alertController: AlertController,
                public alertService: AlertService,
                private orderItemCacheService: OrderItemCacheService,
                private toastService: ToastService,
                private statusService: StatusService,
                private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.setup();
        setTimeout(async () => {
            if (this.table.rowCount === 0) {
                this.table.rowCount = -1;
                await this.toastService.presentToastError('No data or Network error. Please add more data or refresh the page');
            }
        }, 4000);
    }

    ngAfterViewInit(): void {
    }

    ionViewDidEnter() {
        if (this.isDesktop) {
            this.orderItemsDesktop$ = this.orderItemCacheService.getOrderItemsCache$ByOrder(this.orderId);
        } else {
            this.orderItemsMobile$.push(this.orderItemService.getLimitedOrderItemsAfterStart(this.orderId));
        }
    }

    ngOnDestroy(): void {
        console.log('bye bye OrderItemsPage...');

        if (this.orderItemService.isPageFullyLoaded()) {
            this.orderItemService.setPageFullyLoaded(false);
        }
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
        this.orderId = this.activatedRoute.snapshot.params.orderId;
        this.order = this.orderService.getOrder(this.orderId);
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');
    }

    /**
     * Triggered when content being scrolled 100px above the page's bottom to load for more Order Items
     * @param event: CustomerEvent
     */
    loadData(event: any) {
        if (this.orderItemService.isPageFullyLoaded()) {
            event.target.disabled = true;
        } else {
            if (this.isMobile) {
                this.orderItemsMobile$.push(this.orderItemService.getLimitedOrderItemsAfterLastDoc(this.orderId));
                event.target.complete();
            } else {
                // this.orderItemsDesktop$.push(this.orderItemService.getLimitedOrderItemsAfterLastDoc(this.orderId));
                // this.subscription.add(this.orderItemsDesktop$[this.orderItemsDesktop$.length - 1].subscribe(moreOrderItems => {
                //     this.addPaginatedOrderItems(moreOrderItems);
                //     event.target.complete();
                // }));
            }
        }
    }

    /**
     * Add new or updated Order Items to this.orderItems based on OrderItem's index
     * @param moreOrderItems: OrderItem[]
     */
    private addPaginatedOrderItems(moreOrderItems: OrderItem[]) {
        if (moreOrderItems.length > 0) {
            const orderItemIndex = this.orderItems.findIndex(orderItem => orderItem.id === moreOrderItems[0].id);
            if (orderItemIndex >= 0) {
                console.log('edited order item from block: ' + orderItemIndex);
            } else {
                console.log('loaded more order items');
            }

            if (orderItemIndex >= 0) {
                const orderItems = [...this.orderItems];
                orderItems.splice(orderItemIndex, moreOrderItems.length, ...moreOrderItems);
                this.orderItems = orderItems;
            } else {
                let orderItems = [...this.orderItems];
                orderItems = [...orderItems, ...moreOrderItems];
                this.orderItems = [...orderItems];
            }
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

    async presentDeleteOrderItem(row: any) {
        const orderItem = row as OrderItem;
        await this.alertService.presentDeleteConfirm(orderItem);
    }

    getColorClassCell({row, column, value}) {
        const className = row.orderItemColor.replace(/\s/g, '');
        const colorClass = {};
        colorClass[className] = true;
        return colorClass;
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

    getRowClass(row: OrderItem) {
        const statusName = row.orderItemStatus;
        const statusClass = {};
        statusClass[statusName] = true;
        return statusClass;
    }

    getFontClassCellSpan(row: OrderItem, fontIndex: number): any {
        let className = row.orderItemFonts[fontIndex].replace(/\s/g, '');
        className = className.replace('.', '');
        const fontClass = {};
        fontClass[className] = true;
        return fontClass;
    }
}
