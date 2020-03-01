import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderItemService} from '../../../services/order-item.service';
import {Observable} from 'rxjs';
import {Order} from '../../../models/order';
import {OrderService} from '../../../services/order.service';
import {AlertController, Config, Platform} from '@ionic/angular';
import {OrderItem} from '../../../models/orderitem';
import {ActivatedRoute} from '@angular/router';
import {FontService} from '../../../services/font.service';
import {ColorService} from '../../../services/color.service';
import {take} from 'rxjs/operators';
import {Customer} from '../../../models/customer';
import {Product} from "../../../models/product";


@Component({
    selector: 'app-order-items',
    templateUrl: './order-items.page.html',
    styleUrls: ['./order-items.page.scss'],
})
export class OrderItemsPage implements OnInit, OnDestroy {
    orderItemsDesktop$: Observable<OrderItem[]>[] = [];
    orderItemsMobile$: Observable<OrderItem[]>[] = [];
    orderItems: OrderItem[] = [];
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;
    orderId: string;
    order: Observable<Order>;
    fontNames: string[];
    skeletons = [1, 2];

    constructor(private orderItemService: OrderItemService,
                private orderService: OrderService,
                private config: Config,
                private platform: Platform,
                private activatedRoute: ActivatedRoute,
                private fontService: FontService,
                private colorService: ColorService,
                private alertController: AlertController
    ) {
    }

    ngOnInit() {
        this.setup();
        if (this.isDesktop) {
            this.orderItemsDesktop$.push(this.orderItemService.getLimitedOrderItemsAfterStart(this.orderId));
            this.orderItemsDesktop$[0].subscribe(moreOrderItems => {
                this.addPaginatedOrderItems(moreOrderItems);
            });
        } else {
            this.orderItemsMobile$.push(this.orderItemService.getLimitedOrderItemsAfterStart(this.orderId));
        }

    }

    ngOnDestroy(): void {
        if (this.orderItemService.isPageFullyLoaded()) {
            this.orderItemService.setPageFullyLoaded(false);
        }
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
        await this.orderItemService.deleteOrderItem(this.orderId, toDeleteOrderItem);
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
                this.orderItemsDesktop$.push(this.orderItemService.getLimitedOrderItemsAfterLastDoc(this.orderId));
                this.orderItemsDesktop$[this.orderItemsDesktop$.length - 1].subscribe(moreOrderItems => {
                    this.addPaginatedOrderItems(moreOrderItems);
                    event.target.complete();
                });
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
            console.log('edited order item: ' + orderItemIndex);
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
}
