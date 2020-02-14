import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Config, Platform} from '@ionic/angular';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
    orders: Observable<Order[]>;
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;

    constructor(private orderService: OrderService,
                private config: Config,
                private platform: Platform
    ) {
    }

    ngOnInit() {
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');

        this.orders = this.orderService.getOrders();
    }


    open(row) {
        console.log(row);
    }

    deleteCustomer(toDeleteOrder: Order) {
        console.log(toDeleteOrder);
        this.orderService.deleteOrder(toDeleteOrder);
    }
}
