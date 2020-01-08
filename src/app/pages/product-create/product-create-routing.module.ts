import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductCreatePage } from './product-create.page';

const routes: Routes = [
  {
    path: '',
    component: ProductCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCreatePageRoutingModule {}
