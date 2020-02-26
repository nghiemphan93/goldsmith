import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderDetailEditPageRoutingModule } from './order-detail-edit-routing.module';

import { OrderDetailEditPage } from './order-detail-edit.page';
import {OrderCreatePageModule} from '../order-create/order-create.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OrderDetailEditPageRoutingModule,
        ReactiveFormsModule,
        OrderCreatePageModule
    ],
  declarations: [OrderDetailEditPage]
})
export class OrderDetailEditPageModule {}
