import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchCustomerPageRoutingModule } from './search-customer-routing.module';

import { SearchCustomerPage } from './search-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchCustomerPageRoutingModule
  ],
  declarations: [SearchCustomerPage]
})
export class SearchCustomerPageModule {}
