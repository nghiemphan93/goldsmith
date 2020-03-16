import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {observable, Observable, Subscription} from 'rxjs';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {AlertController, Config, Platform} from '@ionic/angular';
import {OrderItemCacheService} from '../../services/order-item-cache.service';
import {OrderItem} from '../../models/orderitem';
import {Product} from '../../models/product';

@Component({
    selector: 'app-search-order-item',
    templateUrl: './search-order-item.page.html',
    styleUrls: ['./search-order-item.page.scss'],
})
export class SearchOrderItemPage implements OnInit, OnDestroy {
    validationForm: FormGroup;
    ordersDesktop$: Observable<Order[]>;
    ordersMobile$: Observable<Order[]>[] = [];
    isDesktop: boolean;
    isMobile: boolean;
    skeletons = [1, 2];
    orders$: Observable<Order[]>;
    orders: Order[] = [];
    subscription = new Subscription();

    orderItems$: Observable<OrderItem[]>[] = [];
    orderItems: OrderItem[] = [];


    constructor(private orderService: OrderService,
                private config: Config,
                private platform: Platform,
                private formBuilder: FormBuilder,
                private orderItemCacheService: OrderItemCacheService
    ) {
    }

    ngOnInit() {
        this.preparePlatform();
        if (this.isDesktop) {
            this.orders$ = this.orderService.getOrders();
            this.prepareFormValidation();
        } else {
        }

        window.dispatchEvent(new Event('resize'));
    }

    ngOnDestroy(): void {
        console.log('bye bye SearchOrderItemPage...');

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
     * Prepare a Reactive Form
     */
    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            orders: new FormControl('', Validators.required),
            toSearchText: new FormControl('')
        });
    }

    /**
     * Helper to select data for <ion-select>
     * @param o1: Object
     * @param o2: Object
     */
    compareWithFn(o1, o2) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }

    testHandler() {
        console.log(this.validationForm.value.order);
    }

    onSelectOrder() {
        const selectedOrders = this.validationForm.value.orders;
        this.orderItemCacheService.setSelectedOrders(selectedOrders);

        // this.orderItems = this.orderItemCacheService.getOrderItemsCache();
        this.orderItemCacheService.getAllOrderItemsCache$().subscribe(orderItems => {
            this.addMoreItems(orderItems);
        });
    }

    /**
     * Add new or updated OrderItems to this.orderItems based on the first orderItem's index
     * @param moreOrderItems: OrderItem[]
     */
    private addMoreItems(moreOrderItems: OrderItem[]) {
        if (moreOrderItems.length > 0) {
            const orderItemIndex = this.orderItems.findIndex(orderItem => orderItem.id === moreOrderItems[0].id);
            if (orderItemIndex >= 0) {
                console.log('edited OrderItems from block: ' + orderItemIndex);
                // delete all items in that order
                this.orderItems = this.orderItems.filter(orderItem => orderItem.order.id !== moreOrderItems[0].order.id);
                // add new orderItems from the index
                this.orderItems.splice(orderItemIndex, 0, ...moreOrderItems);
            } else {
                console.log('added more Order Items');
                this.orderItems.push(...moreOrderItems);
            }
        }
    }

    searchHandler() {
        const toSearchText = this.validationForm.value.toSearchText;
        console.log(toSearchText);
    }
}
