import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerDetailPageRoutingModule } from './customer-detail-routing.module';

import { CustomerDetailPage } from './customer-detail.page';
import {CustomerCreatePageModule} from '../customer-create/customer-create.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CustomerDetailPageRoutingModule,
        CustomerCreatePageModule
    ],
  declarations: [CustomerDetailPage]
})
export class CustomerDetailPageModule {}
