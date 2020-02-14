import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerCreatePage } from './customer-create.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerCreatePageRoutingModule {}
