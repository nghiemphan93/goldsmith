import {Component, OnInit} from '@angular/core';
import {OrderItemService} from '../../../services/order-item.service';
import {Observable} from 'rxjs';
import {Order} from '../../../models/order';
import {OrderService} from '../../../services/order.service';
import {Config, Platform} from '@ionic/angular';
import {OrderItem} from '../../../models/orderitem';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-order-items',
    templateUrl: './order-items.page.html',
    styleUrls: ['./order-items.page.scss'],
})
export class OrderItemsPage implements OnInit {

    orderItems: Observable<OrderItem[]>;
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;
    orderId: string;

    constructor(private orderItemService: OrderItemService,
                private config: Config,
                private platform: Platform,
                private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.orderId = this.activatedRoute.snapshot.params.orderId;
        console.log(this.orderId);

        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');

        this.orderItems = this.orderItemService.getOrderItems(this.orderId);
    }

    deleteOrderItem(toDeleteOrderItem: OrderItem) {
        console.log(toDeleteOrderItem);
        this.orderItemService.deleteOrderItem(this.orderId, toDeleteOrderItem);
    }

}
