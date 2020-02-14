import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerDetailEditPageRoutingModule } from './customer-detail-edit-routing.module';

import { CustomerDetailEditPage } from './customer-detail-edit.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CustomerDetailEditPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [CustomerDetailEditPage]
})
export class CustomerDetailEditPageModule {}
