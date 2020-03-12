import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDetailEditPage } from './user-detail-edit.page';

const routes: Routes = [
  {
    path: '',
    component: UserDetailEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDetailEditPageRoutingModule {}
