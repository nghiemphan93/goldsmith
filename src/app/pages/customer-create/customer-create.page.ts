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

    toTitleCase(s: string) {
        if (typeof s !== 'string') {
            return '';
        }
        return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    }

    async submitHandler() {
        this.newCustomer.firstName = this.toTitleCase(this.validationForm.value.firstName);
        this.newCustomer.lastName = this.toTitleCase(this.validationForm.value.lastName);
        this.newCustomer.nick = this.toTitleCase(this.validationForm.value.nick);
        this.newCustomer.street = this.toTitleCase(this.validationForm.value.street);
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
            this.validationForm.reset({
                country: 'United States'
            });
            await this.router.navigate(['customers']);
        } catch (e) {
            console.log(e);
        }
    }
}
