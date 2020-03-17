import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SearchOrderItemPageRoutingModule} from './search-order-item-routing.module';

import {SearchOrderItemPage} from './search-order-item.page';
import {AgGridModule} from 'ag-grid-angular';
import {HttpClientModule} from '@angular/common/http';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SearchOrderItemPageRoutingModule,
        ReactiveFormsModule,
        AgGridModule,
        HttpClientModule,
        NgxDatatableModule
    ],
    declarations: [SearchOrderItemPage]
})
export class SearchOrderItemPageModule {
}
