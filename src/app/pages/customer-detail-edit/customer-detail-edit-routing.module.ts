import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerDetailEditPage } from './customer-detail-edit.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerDetailEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerDetailEditPageRoutingModule {}
