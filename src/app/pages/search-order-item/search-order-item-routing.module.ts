import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchOrderItemPage } from './search-order-item.page';

const routes: Routes = [
  {
    path: '',
    component: SearchOrderItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchOrderItemPageRoutingModule {}
