import {Component, OnInit} from '@angular/core';
import {OrderItemService} from '../../../services/order-item.service';
import {Observable} from 'rxjs';
import {Order} from '../../../models/order';
import {OrderService} from '../../../services/order.service';
import {Config, Platform} from '@ionic/angular';
import {OrderItem} from '../../../models/orderitem';
import {ActivatedRoute} from '@angular/router';
import {FontService} from '../../../services/font.service';
import {ColorService} from '../../../services/color.service';

// tslint:disable-next-line:max-line-length


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
    selectedColorStyle = {'background-color': 'red'};
    selectedFontStyle = {Scriptina: true};
    backgroundRed = 'backgroundRed';
    selectedColor: string;
    fontNames: string[];

    constructor(private orderItemService: OrderItemService,
                private config: Config,
                private platform: Platform,
                private activatedRoute: ActivatedRoute,
                private fontService: FontService,
                private colorService: ColorService
    ) {
    }

    ngOnInit() {
        this.fontNames = this.fontService.getFontNames();
        this.orderId = this.activatedRoute.snapshot.params.orderId;

        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');

        this.orderItems = this.orderItemService.getOrderItems(this.orderId);
    }

    deleteOrderItem(toDeleteOrderItem: OrderItem) {
        console.log(toDeleteOrderItem);
        this.orderItemService.deleteOrderItem(this.orderId, toDeleteOrderItem);
    }

    private setupFontColorStatus() {

    }

    testColor(row: any) {
        // console.log('jaiwejfi');
        // console.log(row);
        return this.backgroundRed;
    }

    configFontClass(orderItemFontElement: any) {
        // console.log(orderItemFontElement);
    }

    loadTest() {
        console.log('loading test...');
    }

    getFontClass({row, column, value}): any {
        let className = row.orderItemFont.replace(/\s/g, '');
        className = className.replace('.', '');
        const fontClass = {};
        fontClass[className] = true;
        return fontClass;
    }

    getRingColorClass({row, column, value}) {
        if (row.orderItemRingSizeUS) {
            const className = row.orderItemColor.replace(/\s/g, '');

            const colorClass = {};
            colorClass[className] = true;
            return colorClass;
        }
    }

    getNecklaceColorClass({row, column, value}) {
        if (row.orderItemLengthInch) {
            const className = row.orderItemColor.replace(/\s/g, '');

            const colorClass = {};
            colorClass[className] = true;
            return colorClass;
        }
    }

    getQuantityClass({row, column, value}) {
        if (row.orderItemQuantity !== 1) {
            return {quantityGreaterThanOne: true};
        }
    }

    getCommentClass({row, column, value}) {
        return {commentClass: true};
    }
}
