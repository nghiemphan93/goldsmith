import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchCustomerPage } from './search-customer.page';

const routes: Routes = [
  {
    path: '',
    component: SearchCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchCustomerPageRoutingModule {}
