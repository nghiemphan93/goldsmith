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
    customersDesktop$: Observable<Customer[]>;
    customersMobile$: Observable<Customer[]>[] = [];
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;
    skeletons = [1, 2];

    constructor(private customerService: CustomerService,
                private config: Config,
                private platform: Platform,
                private alertController: AlertController,
                private router: Router
    ) {
    }

    ngOnInit() {
        this.preparePlatform();
        if (this.isDesktop) {
            this.customersDesktop$ = this.customerService.getCustomers();
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
            this.customersMobile$.push(this.customerService.getLimitedCustomersAfterLastDoc());
            event.target.complete();
        }
    }
}
