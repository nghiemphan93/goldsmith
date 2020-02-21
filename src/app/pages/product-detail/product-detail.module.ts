import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailPageRoutingModule } from './product-detail-routing.module';

import { ProductDetailPage } from './product-detail.page';
import {ProductCreatePageModule} from '../product-create/product-create.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProductDetailPageRoutingModule,
        ProductCreatePageModule
    ],
  declarations: [ProductDetailPage]
})
export class ProductDetailPageModule {}
