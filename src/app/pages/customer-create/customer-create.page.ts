import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../models/customer';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Value} from '@angular/fire/remote-config';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-customer-create',
    templateUrl: './customer-create.page.html',
    styleUrls: ['./customer-create.page.scss'],
})
export class CustomerCreatePage implements OnInit {
    validationForm: FormGroup;
    isCreated: boolean;
    isUpdated: boolean;
    customer: Customer;


    constructor(private customerService: CustomerService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        const customerId = this.activatedRoute.snapshot.params.customerId;
        if (customerId) {
            try {
                this.isUpdated = true;
                this.customerService.getCustomer(customerId).subscribe(customerFromServer => {
                    this.customer = customerFromServer;
                    this.prepareFormValidationUpdate();
                });
            } catch (e) {
                console.log(e);
            }

        } else {
            this.isCreated = true;
            this.customer = new Customer();
            this.prepareFormValidationCreate();
        }
    }


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

    prepareFormValidationUpdate() {
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

    toTitleCase(s: string) {
        if (typeof s !== 'string') {
            return '';
        }
        return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    async submitHandler() {
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
        this.customer.createdAt = new Date();

        try {
            if (this.isCreated) {
                const documentRef = await this.customerService.createCustomer(this.customer);
                console.log(documentRef);
            } else {
                const documentRef = await this.customerService.updateCustomer(this.customer);
                console.log(documentRef);
            }
            this.validationForm.reset({
                country: 'United States'
            });
            await this.router.navigate(['customers']);
        } catch (e) {
            console.log(e);
        }
    }
}
