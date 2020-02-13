import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DemoTablePageRoutingModule } from './demo-table-routing.module';

import { DemoTablePage } from './demo-table.page';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DemoTablePageRoutingModule,
        NgxDatatableModule
    ],
  declarations: [DemoTablePage]
})
export class DemoTablePageModule {}
