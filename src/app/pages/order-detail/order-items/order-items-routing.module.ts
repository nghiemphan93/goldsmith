import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderItemsPage } from './order-items.page';

const routes: Routes = [
  {
    path: '',
    component: OrderItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderItemsPageRoutingModule {}
