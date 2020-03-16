import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchOrderItemPageRoutingModule } from './search-order-item-routing.module';

import { SearchOrderItemPage } from './search-order-item.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SearchOrderItemPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [SearchOrderItemPage]
})
export class SearchOrderItemPageModule {}
