import {Component, OnInit} from '@angular/core';
import {Customer} from '../../models/customer';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Value} from '@angular/fire/remote-config';

@Component({
    selector: 'app-customer-create',
    templateUrl: './customer-create.page.html',
    styleUrls: ['./customer-create.page.scss'],
})
export class CustomerCreatePage implements OnInit {
    newCustomer = new Customer();
    validationForm: FormGroup;
    isCreated: boolean;

    constructor(private customerService: CustomerService,
                private formBuilder: FormBuilder,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.prepareFormValidation();
    }


    prepareFormValidation() {
        // this.validationForm = this.formBuilder.group({
        //     firstName: new FormControl('Veronica', Validators.required),
        //     lastName: new FormControl('Flores', Validators.required),
        //     nick: new FormControl('Veronica Flores'),
        //     street: new FormControl('McConnell Ave', Validators.required),
        //     number: new FormControl('8318', Validators.required),
        //     extraInfor: new FormControl(''),
        //     city: new FormControl('SAN FRANCISCO', Validators.required),
        //     state: new FormControl('CA', Validators.required),
        //     postal: new FormControl('90045', Validators.required),
        //     country: new FormControl('United States', Validators.required)
        // });

        this.validationForm = this.formBuilder.group({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            nick: new FormControl(''),
            street: new FormControl('', Validators.required),
            number: new FormControl('', Validators.required),
            extraInfor: new FormControl(''),
            city: new FormControl('', Validators.required),
            state: new FormControl('', Validators.required),
            postal: new FormControl('', Validators.required),
            country: new FormControl('', Validators.required)
        });
    }

    async submitHandler() {
        this.newCustomer.firstName = this.validationForm.value.firstName;
        this.newCustomer.lastName = this.validationForm.value.lastName;
        this.newCustomer.nick = this.validationForm.value.nick;
        this.newCustomer.street = this.validationForm.value.street;
        this.newCustomer.number = this.validationForm.value.number;
        this.newCustomer.extraInfor = this.validationForm.value.extraInfor;
        this.newCustomer.city = this.validationForm.value.city.toUpperCase();
        this.newCustomer.state = this.validationForm.value.state.toUpperCase();
        this.newCustomer.country = this.validationForm.value.country;
        this.newCustomer.postal = this.validationForm.value.postal;
        this.newCustomer.createdAt = new Date();

        try {
            const documentRef = await this.customerService.createCustomer(this.newCustomer);
            console.log(documentRef);
            await this.router.navigate(['customers']);
        } catch (e) {
            console.log(e);
        }
    }
}
