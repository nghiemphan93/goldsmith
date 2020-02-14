import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerDetailPage } from './customer-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerDetailPageRoutingModule {}
