import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {AlertController, Config, Platform} from '@ionic/angular';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {SelectionType} from '@swimlane/ngx-datatable';
import {OrderItemCacheService} from '../../services/order-item-cache.service';
import {OrderCacheService} from '../../services/order-cache.service';


@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {
    ordersDesktop$: Observable<Order[]>;
    ordersMobile$: Observable<Order[]>[] = [];
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;
    skeletons = [1, 2];
    orders: Order[] = [];
    subscription = new Subscription();


    constructor(private orderService: OrderService,
                private config: Config,
                private platform: Platform,
                private alertController: AlertController,
                private orderItemCacheService: OrderItemCacheService,
                private orderCacheService: OrderCacheService
    ) {
    }

    ngOnInit() {
        this.preparePlatform();
        if (this.isDesktop) {
            this.ordersDesktop$ = this.orderCacheService.getOrdersCache$();
        } else {
            this.ordersMobile$.push(this.orderService.getLimitedOrdersAfterStart());
        }
    }

    ngOnDestroy(): void {
        console.log('bye bye OrdersPage...');

        if (this.orderService.isPageFullyLoaded()) {
            this.orderService.setPageFullyLoaded(false);
        }

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Identify which platform is being used
     */
    private preparePlatform() {
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');
    }

    /**
     * Showing alert when clicking Delete Button
     * @param toDeleteOrder: Product
     */
    async presentDeleteConfirm(toDeleteOrder: Order) {
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
                        this.deleteOrder(toDeleteOrder);
                    }
                }
            ]
        });

        await alert.present();
    }

    /**
     * Handler to delete an order
     * @param toDeleteOrder: Order
     */
    async deleteOrder(toDeleteOrder: Order) {
        console.log(toDeleteOrder);
        await this.orderService.deleteOrder(toDeleteOrder);
    }

    /**
     * Triggered when content being scrolled 100px above the page's bottom to load for more Orders
     * @param event: CustomerEvent
     */
    loadData(event: any) {
        if (this.orderService.isPageFullyLoaded()) {
            event.target.disabled = true;
        } else {
            this.ordersMobile$.push(this.orderService.getLimitedOrdersAfterLastDoc());
            event.target.complete();
        }
    }
}
