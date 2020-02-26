import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderItemDetailPageRoutingModule } from './order-item-detail-routing.module';

import { OrderItemDetailPage } from './order-item-detail.page';
import {OrderItemCreatePageModule} from '../order-item-create/order-item-create.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OrderItemDetailPageRoutingModule,
        OrderItemCreatePageModule
    ],
  declarations: [OrderItemDetailPage]
})
export class OrderItemDetailPageModule {}
