import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AlertController, Config, Platform} from '@ionic/angular';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {Product} from '../../models/product';

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

    constructor(private orderService: OrderService,
                private config: Config,
                private platform: Platform,
                private alertController: AlertController
    ) {
    }

    ngOnInit() {
        this.preparePlatform();
        if (this.isDesktop) {
            this.ordersDesktop$ = this.orderService.getOrders();
        } else {
            this.ordersMobile$.push(this.orderService.getLimitedOrdersAfterStart());
        }

    }

    ngOnDestroy(): void {
        if (this.orderService.isPageFullyLoaded()) {
            this.orderService.setPageFullyLoaded(false);
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
     * handler to delete an order
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
