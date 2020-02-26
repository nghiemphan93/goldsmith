import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderItemDetailEditPageRoutingModule } from './order-item-detail-edit-routing.module';

import { OrderItemDetailEditPage } from './order-item-detail-edit.page';
import {OrderItemCreatePageModule} from '../order-item-create/order-item-create.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OrderItemDetailEditPageRoutingModule,
        OrderItemCreatePageModule
    ],
  declarations: [OrderItemDetailEditPage]
})
export class OrderItemDetailEditPageModule {}
