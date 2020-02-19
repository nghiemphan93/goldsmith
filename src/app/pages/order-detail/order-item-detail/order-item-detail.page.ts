import {Component, OnInit} from '@angular/core';
import {OrderItemService} from '../../../services/order-item.service';

@Component({
    selector: 'app-order-item-detail',
    templateUrl: './order-item-detail.page.html',
    styleUrls: ['./order-item-detail.page.scss'],
})
export class OrderItemDetailPage implements OnInit {

    constructor(private orderItemService: OrderItemService) {
    }

    ngOnInit() {
        this.orderItemService.getOrderItem('934tU103Z6fuuB9WPKWK', 'iowKnytsJPQsX9fGeHDj')
            .subscribe(orderItem => {
                console.log(orderItem);
            });
    }

}
