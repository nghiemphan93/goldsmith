import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderCreatePage } from './order-create.page';

const routes: Routes = [
  {
    path: '',
    component: OrderCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderCreatePageRoutingModule {}
