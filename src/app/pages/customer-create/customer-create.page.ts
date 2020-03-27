import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Customer} from '../../models/customer';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AlertService} from '../../services/alert.service';
import {ToastService} from '../../services/toast.service';
import {IonButton} from '@ionic/angular';

@Component({
    selector: 'app-customer-create',
    templateUrl: './customer-create.page.html',
    styleUrls: ['./customer-create.page.scss'],
})
export class CustomerCreatePage implements OnInit, OnDestroy {
    subscription = new Subscription();
    validationForm: FormGroup;
    isCreated: boolean;
    isUpdated: boolean;
    isDetailed: boolean;
    customer: Customer;
    @ViewChild('submitButton') submitButton: ElementRef;

    constructor(private customerService: CustomerService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private alertService: AlertService,
                private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.preparePageContent();
    }

    ngOnDestroy(): void {
        console.log('bye bye CustomerCreatePage...');
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Identify what purpose of the page should be.
     * Create, Edit or Detail of a Customer
     */
    preparePageContent() {
        const customerId = this.activatedRoute.snapshot.params.customerId;
        const url = this.router.url.split('/');


        switch (url[url.length - 1]) {
            case 'create':
                this.isCreated = true;
                this.customer = new Customer();
                this.prepareFormValidationCreate();
                break;
            case 'edit':
                try {
                    this.isUpdated = true;
                    this.subscription.add(this.customerService.getCustomer(customerId).subscribe(customerFromServer => {
                        this.customer = customerFromServer;
                        this.prepareFormValidationUpdateOrDetail();
                    }));
                } catch (e) {
                    console.log(e);
                }
                break;
            default :
                try {
                    this.isDetailed = true;
                    this.subscription.add(this.customerService.getCustomer(customerId).subscribe(customerFromServer => {
                        this.customer = customerFromServer;
                        this.prepareFormValidationUpdateOrDetail();
                    }));
                } catch (e) {
                    console.log(e);
                }
                break;
        }
    }

    /**
     * Prepare a Reactive Form for Creating a Customer
     */
    prepareFormValidationCreate() {
        this.validationForm = this.formBuilder.group({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            nick: new FormControl(''),
            street: new FormControl(''),
            number: new FormControl(''),
            extraInfor: new FormControl(''),
            city: new FormControl('', Validators.required),
            state: new FormControl('', Validators.required),
            postal: new FormControl('', Validators.required),
            country: new FormControl('United States', Validators.required)
        });
    }

    /**
     * Prepare a Reactive Form for Editing or Showing Details of a Customer
     */
    prepareFormValidationUpdateOrDetail() {
        this.validationForm = this.formBuilder.group({
            firstName: new FormControl(this.customer.firstName, Validators.required),
            lastName: new FormControl(this.customer.lastName, Validators.required),
            nick: new FormControl(this.customer.nick),
            street: new FormControl(this.customer.street),
            number: new FormControl(this.customer.number),
            extraInfor: new FormControl(this.customer.extraInfor),
            city: new FormControl(this.customer.city, Validators.required),
            state: new FormControl(this.customer.state, Validators.required),
            postal: new FormControl(this.customer.postal, Validators.required),
            country: new FormControl(this.customer.country, Validators.required)
        });
    }

    /**
     * Helper function to transform a string to title case
     * @param s: any string
     */
    toTitleCase(s: string) {
        if (typeof s !== 'string') {
            return '';
        }
        return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    /**
     * Handler Submit button
     */
    async submitHandler(submitButton: IonButton) {
        submitButton.disabled = true;

        this.customer.firstName = this.toTitleCase(this.validationForm.value.firstName);
        this.customer.lastName = this.toTitleCase(this.validationForm.value.lastName);
        this.customer.nick = this.toTitleCase(this.validationForm.value.nick);
        this.customer.street = this.toTitleCase(this.validationForm.value.street);
        this.customer.number = this.validationForm.value.number;
        this.customer.extraInfor = this.validationForm.value.extraInfor;
        this.customer.city = this.validationForm.value.city.toUpperCase();
        this.customer.state = this.validationForm.value.state.toUpperCase();
        this.customer.country = this.validationForm.value.country;
        this.customer.postal = this.validationForm.value.postal;

        try {
            if (this.isCreated) {
                this.customer.createdAt = new Date();
                await this.customerService.createCustomer(this.customer);
                await this.toastService.presentToastSuccess(`Created ${this.customer.firstName} ${this.customer.lastName} successfully`);
            } else {
                await this.customerService.updateCustomer(this.customer);
                await this.toastService.presentToastSuccess(`Updated ${this.customer.firstName} ${this.customer.lastName} successfully`);
            }
            this.validationForm.reset({
                country: 'United States'
            });
            await this.router.navigate(['customers']);
            window.dispatchEvent(new Event('resize'));
        } catch (e) {
            console.log(e);
            await this.toastService.presentToastError(e.message);
        }
    }
}
