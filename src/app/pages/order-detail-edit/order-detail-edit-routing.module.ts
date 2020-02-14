import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderDetailEditPage } from './order-detail-edit.page';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderDetailEditPageRoutingModule {}
