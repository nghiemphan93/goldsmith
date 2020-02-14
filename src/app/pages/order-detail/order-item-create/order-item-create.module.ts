import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderItemCreatePageRoutingModule } from './order-item-create-routing.module';

import { OrderItemCreatePage } from './order-item-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderItemCreatePageRoutingModule
  ],
  declarations: [OrderItemCreatePage]
})
export class OrderItemCreatePageModule {}
