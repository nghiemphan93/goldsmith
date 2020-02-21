import {Component, OnInit} from '@angular/core';
import {Customer} from '../../models/customer';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-customer-detail-edit',
    templateUrl: './customer-detail-edit.page.html',
    styleUrls: ['./customer-detail-edit.page.scss'],
})
export class CustomerDetailEditPage implements OnInit {
    constructor() {
    }

    ngOnInit() {

    }
}
