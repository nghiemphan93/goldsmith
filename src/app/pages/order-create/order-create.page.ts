import {Component, OnInit} from '@angular/core';
import {Customer} from '../../models/customer';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {Status} from '../../models/status.enum';

@Component({
    selector: 'app-order-create',
    templateUrl: './order-create.page.html',
    styleUrls: ['./order-create.page.scss'],
})
export class OrderCreatePage implements OnInit {
    newOrder = new Order();
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
        this.prepareFormValidation();
        console.log(this.today);
    }


    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            orderCode: new FormControl('', Validators.required),
            orderStatus: new FormControl(Status.PENDING, Validators.required),
            orderDeadline: new FormControl('', Validators.required)
        });
    }

    async submitHandler() {
        this.newOrder.orderCode = this.validationForm.value.orderCode;
        this.newOrder.orderStatus = this.validationForm.value.orderStatus;
        this.newOrder.orderDeadline = this.validationForm.value.orderDeadline;
        this.newOrder.createdAt = new Date();

        console.log(this.newOrder);
        try {
            const documentRef = await this.orderService.createOrder(this.newOrder);
            console.log(documentRef);
            await this.router.navigate(['orders']);
        } catch (e) {
            console.log(e);
        }
    }
}
