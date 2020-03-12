import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserDetailPageRoutingModule } from './user-detail-routing.module';

import { UserDetailPage } from './user-detail.page';
import {UserCreatePageModule} from '../user-create/user-create.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserDetailPageRoutingModule,
        UserCreatePageModule
    ],
  declarations: [UserDetailPage]
})
export class UserDetailPageModule {}
