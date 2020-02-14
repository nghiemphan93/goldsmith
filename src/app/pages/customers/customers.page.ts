import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Product} from '../../models/product';
import {ProductService} from '../../services/product.service';
import {Config, Platform} from '@ionic/angular';
import {Customer} from '../../models/customer';
import {CustomerService} from '../../services/customer.service';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.page.html',
    styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
    customers: Observable<Customer[]>;
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;

    constructor(private customerService: CustomerService,
                private config: Config,
                private platform: Platform
    ) {
    }

    ngOnInit() {
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');

        this.customers = this.customerService.getCustomers();
    }


    open(row) {
        console.log(row);
    }

    deleteCustomer(toDeleteCustomer: Customer) {
        console.log(toDeleteCustomer);
        this.customerService.deleteCustomer(toDeleteCustomer);
    }
}
