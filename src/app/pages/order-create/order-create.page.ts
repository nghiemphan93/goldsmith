import {Component, OnDestroy, OnInit} from '@angular/core';
import {Customer} from '../../models/customer';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {Status} from '../../models/status.enum';
import {Product} from '../../models/product';
import {StatusService} from '../../services/status.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-order-create',
    templateUrl: './order-create.page.html',
    styleUrls: ['./order-create.page.scss'],
})
export class OrderCreatePage implements OnInit, OnDestroy {
    subscription = new Subscription();
    order: Order;
    validationForm: FormGroup;
    isCreated: boolean;
    isUpdated: boolean;
    minDeadline = new Date(new Date().setDate(new Date().getDate() + 4));
    statuses: (string | Status)[];

    constructor(private orderService: OrderService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private statusService: StatusService
    ) {
    }

    ngOnInit() {
        this.preparePageContent();
    }

    ngOnDestroy(): void {
        console.log('bye bye OrderCreatePage...');
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Identify what purpose of the page should be.
     * Create or Edit of an Order
     */
    preparePageContent() {
        this.statuses = this.statusService.getStatuses();
        const orderId = this.activatedRoute.snapshot.params.orderId;
        const url = this.router.url.split('/');

        switch (url[url.length - 1]) {
            case 'create':
                this.isCreated = true;
                this.order = new Order();
                this.prepareFormValidationCreate();
                break;
            case 'edit':
                try {
                    this.isUpdated = true;
                    this.subscription.add(this.orderService.getOrder(orderId).subscribe(orderFromServer => {
                        this.order = orderFromServer;
                        this.prepareFormValidationUpdate();
                    }));
                } catch (e) {
                    console.log(e);
                }
                break;
        }
    }

    /**
     * Prepare a Reactive Form for Creating an Order
     */
    prepareFormValidationCreate() {
        this.validationForm = this.formBuilder.group({
            orderCode: new FormControl('', Validators.required),
            orderStatus: new FormControl(this.statuses[0], Validators.required),
            orderDeadline: new FormControl('', Validators.required)
        });
    }

    /**
     * Prepare a Reactive Form for Updating an Order
     */
    prepareFormValidationUpdate() {
        this.validationForm = this.formBuilder.group({
            orderCode: new FormControl(this.order.orderCode, Validators.required),
            orderStatus: new FormControl(this.order.orderStatus, Validators.required),
            orderDeadline: new FormControl(this.order.orderDeadline, Validators.required)
        });
    }

    /**
     * Handler Submit button
     */
    async submitHandler() {
        this.order.orderCode = this.validationForm.value.orderCode;
        this.order.orderStatus = this.validationForm.value.orderStatus;
        this.order.orderDeadline = this.validationForm.value.orderDeadline;

        try {
            if (this.isCreated) {
                this.order.createdAt = new Date();
                const documentRef = await this.orderService.createOrder(this.order);
                console.log(documentRef);
                this.validationForm.reset();
            } else {
                const documentRef = await this.orderService.updateOrder(this.order);
                console.log(documentRef);
                this.validationForm.reset();
            }

            this.validationForm.reset({
                orderCode: '',
                orderStatus: this.statuses[0],
                orderDeadline: '',
            });
            await this.router.navigate(['orders']);
            window.dispatchEvent(new Event('resize'));
        } catch (e) {
            console.log(e);
        }
    }
}
