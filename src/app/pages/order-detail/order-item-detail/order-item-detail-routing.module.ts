import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderItemDetailPage } from './order-item-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OrderItemDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderItemDetailPageRoutingModule {}
