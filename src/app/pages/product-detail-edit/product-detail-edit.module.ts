import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailEditPageRoutingModule } from './product-detail-edit-routing.module';

import { ProductDetailEditPage } from './product-detail-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailEditPageRoutingModule
  ],
  declarations: [ProductDetailEditPage]
})
export class ProductDetailEditPageModule {}
