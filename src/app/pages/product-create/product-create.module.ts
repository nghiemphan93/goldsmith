import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductCreatePageRoutingModule } from './product-create-routing.module';

import { ProductCreatePage } from './product-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductCreatePageRoutingModule
  ],
  declarations: [ProductCreatePage]
})
export class ProductCreatePageModule {}
