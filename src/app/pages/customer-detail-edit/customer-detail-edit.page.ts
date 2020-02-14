import {Component, OnInit} from '@angular/core';
import {Customer} from '../../models/customer';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-customer-detail-edit',
    templateUrl: './customer-detail-edit.page.html',
    styleUrls: ['./customer-detail-edit.page.scss'],
})
export class CustomerDetailEditPage implements OnInit {

    topUpdateCustomer: Customer;
    validationForm: FormGroup;
    isCreated: boolean;

    constructor(private customerService: CustomerService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        const customerId = this.activatedRoute.snapshot.params.customerId;
        try {
            this.customerService.getCustomer(customerId).subscribe(customerFromServer => {
                this.topUpdateCustomer = customerFromServer;
                console.log(this.topUpdateCustomer);

                this.prepareFormValidation();
            });
        } catch (e) {
            console.log(e);
        }

    }


    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            firstName: new FormControl(this.topUpdateCustomer.firstName, Validators.required),
            lastName: new FormControl(this.topUpdateCustomer.lastName, Validators.required),
            nick: new FormControl(this.topUpdateCustomer.nick),
            street: new FormControl(this.topUpdateCustomer.street, Validators.required),
            number: new FormControl(this.topUpdateCustomer.number, Validators.required),
            extraInfor: new FormControl(this.topUpdateCustomer.extraInfor),
            city: new FormControl(this.topUpdateCustomer.city, Validators.required),
            state: new FormControl(this.topUpdateCustomer.state, Validators.required),
            postal: new FormControl(this.topUpdateCustomer.postal, Validators.required),
            country: new FormControl(this.topUpdateCustomer.country, Validators.required)
        });
    }

    async submitHandler() {
        this.topUpdateCustomer.firstName = this.validationForm.value.firstName;
        this.topUpdateCustomer.lastName = this.validationForm.value.lastName;
        this.topUpdateCustomer.nick = this.validationForm.value.nick;
        this.topUpdateCustomer.street = this.validationForm.value.street;
        this.topUpdateCustomer.number = this.validationForm.value.number;
        this.topUpdateCustomer.extraInfor = this.validationForm.value.extraInfor;
        this.topUpdateCustomer.city = this.validationForm.value.city.toUpperCase();
        this.topUpdateCustomer.state = this.validationForm.value.state.toUpperCase();
        this.topUpdateCustomer.country = this.validationForm.value.country;
        this.topUpdateCustomer.postal = this.validationForm.value.postal;
        // this.topUpdateCustomer.createdAt = new Date();

        try {
            const documentRef = await this.customerService.updateCustomer(this.topUpdateCustomer);
            console.log(documentRef);
            await this.router.navigate(['customers']);
        } catch (e) {
            console.log(e);
        }
    }
}
