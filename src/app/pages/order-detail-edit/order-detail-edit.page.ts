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
    constructor() {
    }

    ngOnInit() {
    }
}
