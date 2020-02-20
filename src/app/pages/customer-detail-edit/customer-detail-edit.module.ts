import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CustomerDetailEditPageRoutingModule} from './customer-detail-edit-routing.module';

import {CustomerDetailEditPage} from './customer-detail-edit.page';
import {CustomerCreatePageModule} from '../customer-create/customer-create.module';
import {CustomerCreatePage} from '../customer-create/customer-create.page';
import {CustomersPageModule} from '../customers/customers.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CustomerDetailEditPageRoutingModule,
        ReactiveFormsModule,
        CustomerCreatePageModule,
        CustomersPageModule
    ],
    declarations: [CustomerDetailEditPage]
})
export class CustomerDetailEditPageModule {
}
