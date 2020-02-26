import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {OrderItemCreatePageRoutingModule} from './order-item-create-routing.module';

import {OrderItemCreatePage} from './order-item-create.page';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OrderItemCreatePageRoutingModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    exports: [
        OrderItemCreatePage
    ],
    declarations: [OrderItemCreatePage]
})
export class OrderItemCreatePageModule {
}
