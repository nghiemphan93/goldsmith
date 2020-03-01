import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AlertController, Config, Platform} from '@ionic/angular';
import {Customer} from '../../models/customer';
import {CustomerService} from '../../services/customer.service';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.page.html',
    styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit, OnDestroy {
    customersMobile$: Observable<Customer[]>[] = [];
    customersDesktop$: Observable<Customer[]>[] = [];
    customers: Customer[] = [];
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;
    skeletons = [1, 2];

    constructor(private customerService: CustomerService,
                private config: Config,
                private platform: Platform,
                private alertController: AlertController
    ) {
    }

    ngOnInit() {
        this.preparePlatform();
        if (this.isDesktop) {
            this.customersDesktop$.push(this.customerService.getLimitedCustomersAfterStart());
            this.customersDesktop$[0].subscribe(moreCustomers => {
                this.addPaginatedCustomers(moreCustomers);
            });
        } else {
            this.customersMobile$.push(this.customerService.getLimitedCustomersAfterStart());
        }
    }

    ngOnDestroy(): void {
        if (this.customerService.isPageFullyLoaded()) {
            this.customerService.setPageFullyLoaded(false);
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
     * Showing alert when clicking Delete Button
     * @param toDeleteCustomer: Customer
     */
    async presentDeleteConfirm(toDeleteCustomer: Customer) {
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: '<strong>Are you sure to delete?</strong>!!!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('canceled');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        console.log('okay');
                        this.deleteCustomer(toDeleteCustomer);
                    }
                }
            ]
        });

        await alert.present();
    }

    /**
     * Handler to delete a customer
     * @param toDeleteCustomer: Customer
     */
    async deleteCustomer(toDeleteCustomer: Customer) {
        console.log(toDeleteCustomer);
        await this.customerService.deleteCustomer(toDeleteCustomer);
    }

    /**
     * Triggered when content being scrolled 100px above the page's bottom to load for more Customers
     * @param event: CustomerEvent
     */
    loadData(event: any) {
        if (this.customerService.isPageFullyLoaded()) {
            event.target.disabled = true;
        } else {
            if (this.isMobile) {
                this.customersMobile$.push(this.customerService.getLimitedCustomersAfterLastDoc());
                event.target.complete();
            } else {
                this.customersDesktop$.push(this.customerService.getLimitedCustomersAfterLastDoc());
                this.customersDesktop$[this.customersDesktop$.length - 1].subscribe(moreCustomers => {
                    this.addPaginatedCustomers(moreCustomers);
                    event.target.complete();
                });
            }
        }
    }

    /**
     * Add new or updated Customers to this.customers based on customer's index
     * @param moreCustomers: Customer[]
     */
    private addPaginatedCustomers(moreCustomers: Customer[]) {
        if (moreCustomers.length > 0) {
            const customerIndex = this.customers.findIndex(customer => customer.id === moreCustomers[0].id);
            console.log('edited customer: ' + customerIndex);
            if (customerIndex >= 0) {
                const customers = [...this.customers];
                customers.splice(customerIndex, moreCustomers.length, ...moreCustomers);
                this.customers = customers;
            } else {
                let customers = [...this.customers];
                customers = [...customers, ...moreCustomers];
                this.customers = [...customers];
            }
        }
    }
}
