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
import * as XLSX from 'xlsx';
import {ProductType} from '../../../models/product-type';


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
    tableStyle = 'material striped';
    isDesktop: boolean;
    isMobile: boolean;
    orderId: string;
    order: Observable<Order>;
    fontNames: string[];
    skeletons = [1, 2];
    editingOrderItem = {};
    customActionSheetOptions: any = {
        header: 'Status',
        cssClass: 'test'
    };
    statuses = this.statusService.getStatuses();
    @ViewChild('table') table: DatatableComponent;
    user$ = this.authService.getCurrentUser$();
    isAuth$ = this.authService.getIsAuth$();

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
            if (this.isDesktop && this.table.rowCount === 0) {
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

            // this.orderItemsDesktop$.subscribe(orderItems => {
            //     const tableData = orderItems.map(orderItem => {
            //         const data = [];
            //         data.push(orderItem.orderItemStatus);
            //         data.push(orderItem.orderItemComment);
            //         data.push(orderItem.orderItemCode);
            //         let words = '';
            //         orderItem.orderItemWords.forEach(word => words = words + word + ' \n');
            //         data.push(words);
            //         let fonts = '';
            //         orderItem.orderItemFonts.forEach(font => fonts = fonts + font + ' \n');
            //         data.push(fonts);
            //         data.push(orderItem.orderItemQuantity);
            //         if (orderItem.orderItemRingSizeUS !== undefined) {
            //             const product = `${orderItem.product.productName} \n${orderItem.orderItemColor} \nRing Size: ${orderItem.orderItemRingSizeUS}`;
            //             data.push(product);
            //         } else {
            //             const product = `${orderItem.product.productName} \n${orderItem.orderItemColor} \nSize: ${orderItem.orderItemLengthInch} inches`;
            //             data.push(product);
            //         }
            //         data.push(orderItem.customer);
            //         return data;
            //     });
            //     console.log(tableData);
            //     if (tableData.length > 0) {
            //         const header = ['Status', 'Comment', 'Order Item Code', 'Words', 'Fonts', 'Quantity', 'Product', 'Customer'];
            //         tableData.splice(0, 0, header);
            //         /* generate worksheet */
            //         const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableData);
            //
            //         /* generate workbook and add the worksheet */
            //         const wb: XLSX.WorkBook = XLSX.utils.book_new();
            //         XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            //
            //         /* save to file */
            //         XLSX.writeFile(wb, 'SheetJS.xlsx');
            //     }
            // });
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

    async updateOrderItem(event: Event | any, attributeName: string, rowIndex: number, toUpdateOrderItem: OrderItem) {
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
        // return this.fontService.getFontClass(orderItem.orderItemFont);
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

    getRowClass(row: OrderItem) {
        let statusName: string | Status = row.orderItemStatus;
        if (statusName === Status.RESERVED) {
            statusName = statusName.toString().replace(/\s/g, '_');
            const statusClass = {};
            statusClass[statusName] = true;
            return statusClass;
        }
    }

    getFontClassCellSpan(row: OrderItem, fontIndex: number): any {
        let className = row.orderItemFonts[fontIndex].replace(/\s/g, '');
        className = className.replace('.', '');
        const fontClass = {};
        fontClass[className] = true;
        return fontClass;
    }

    getColorClassCell({row, column, value}) {
        const className = row.orderItemColor.replace(/\s/g, '');
        const colorClass = {};
        colorClass[className] = true;
        return colorClass;
    }

    getStatusClass({row, column, value}) {
        let statusName: string | Status = row.orderItemStatus;
        if (statusName !== Status.RESERVED) {
            statusName = statusName.toString().replace(/\s/g, '_');
            const statusClass = {};
            statusClass[statusName] = true;
            return statusClass;
        }
    }

    isRing(productType: string) {
        return productType.toUpperCase() === ProductType.NHAN;
    }

    isNecklace(productType: string) {
        return productType.toUpperCase() === ProductType.DAY || productType.toUpperCase() === ProductType.VONG;
    }
}
