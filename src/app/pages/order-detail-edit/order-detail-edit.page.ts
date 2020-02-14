import {Component, OnInit} from '@angular/core';
import {Order} from '../../models/order';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OrderService} from '../../services/order.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-order-detail-edit',
    templateUrl: './order-detail-edit.page.html',
    styleUrls: ['./order-detail-edit.page.scss'],
})
export class OrderDetailEditPage implements OnInit {
    toUpdateOrder: Order;
    validationForm: FormGroup;
    isCreated: boolean;
    today = new Date();
    fourDaysFromNow = new Date(new Date().setDate(new Date().getDate() + 4));

    constructor(private orderService: OrderService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        const orderId = this.activatedRoute.snapshot.params.orderId;
        console.log(orderId);
        try {
            this.orderService.getOrder(orderId).subscribe(orderFromServer => {
                this.toUpdateOrder = orderFromServer;
                console.log(this.toUpdateOrder);

                this.prepareFormValidation();
            });
        } catch (e) {
            console.log(e);
        }
    }

    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            orderCode: new FormControl(this.toUpdateOrder.orderCode, Validators.required),
            orderStatus: new FormControl(this.toUpdateOrder.orderStatus, Validators.required),
            orderDeadline: new FormControl(this.toUpdateOrder.orderDeadline, Validators.required)
        });
    }

    async submitHandler() {
        this.toUpdateOrder.orderCode = this.validationForm.value.orderCode;
        this.toUpdateOrder.orderStatus = this.validationForm.value.orderStatus;
        this.toUpdateOrder.orderDeadline = this.validationForm.value.orderDeadline;
        // this.toUpdateOrder.createdAt = new Date();

        console.log(this.toUpdateOrder);
        try {
            const documentRef = await this.orderService.updateOrder(this.toUpdateOrder);
            console.log(documentRef);
            await this.router.navigate(['orders']);
        } catch (e) {
            console.log(e);
        }
    }
}
