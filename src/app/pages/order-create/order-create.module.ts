import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderCreatePageRoutingModule } from './order-create-routing.module';

import { OrderCreatePage } from './order-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderCreatePageRoutingModule
  ],
  declarations: [OrderCreatePage]
})
export class OrderCreatePageModule {}
