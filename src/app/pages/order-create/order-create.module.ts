import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderCreatePageRoutingModule } from './order-create-routing.module';

import { OrderCreatePage } from './order-create.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OrderCreatePageRoutingModule,
        ReactiveFormsModule
    ],
    exports: [
        OrderCreatePage
    ],
    declarations: [OrderCreatePage]
})
export class OrderCreatePageModule {}
