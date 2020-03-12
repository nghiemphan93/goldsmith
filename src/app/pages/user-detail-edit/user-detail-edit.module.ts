import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {UserDetailEditPageRoutingModule} from './user-detail-edit-routing.module';

import {UserDetailEditPage} from './user-detail-edit.page';
import {ProductCreatePageModule} from '../product-create/product-create.module';
import {UserCreatePageModule} from '../user-create/user-create.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UserDetailEditPageRoutingModule,
        UserCreatePageModule,
    ],
    declarations: [UserDetailEditPage]
})
export class UserDetailEditPageModule {
}
