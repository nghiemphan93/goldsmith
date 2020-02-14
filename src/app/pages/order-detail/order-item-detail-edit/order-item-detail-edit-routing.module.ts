import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderItemDetailEditPage } from './order-item-detail-edit.page';

const routes: Routes = [
  {
    path: '',
    component: OrderItemDetailEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderItemDetailEditPageRoutingModule {}
