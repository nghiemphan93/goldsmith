import {Component, OnInit} from '@angular/core';
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
export class CustomersPage implements OnInit {
    customers: Observable<Customer[]>;
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
        this.customers = this.customerService.getCustomers();
    }

    /**
     * Identify which platform is being used
     */
    private preparePlatform() {
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');
    }

    /**
     * Handler to delete a customer
     * @param toDeleteCustomer: Customer
     */
    deleteCustomer(toDeleteCustomer: Customer) {
        console.log(toDeleteCustomer);
        this.customerService.deleteCustomer(toDeleteCustomer);
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

    doRefresh(event) {
        setTimeout(async () => {

            event.target.complete();
            await this.router.navigate(['customers']);

            console.log('refreshed...');
        }, 2000);
    }
}
