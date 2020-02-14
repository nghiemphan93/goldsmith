import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderItemCreatePage } from './order-item-create.page';

const routes: Routes = [
  {
    path: '',
    component: OrderItemCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderItemCreatePageRoutingModule {}
