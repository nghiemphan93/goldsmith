import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {OrderDetailPage} from './order-detail.page';

const routes: Routes = [
    {
        path: '',
        component: OrderDetailPage
    },
    {
        path: 'orderitems',
        loadChildren: () => import('./order-items/order-items.module').then(m => m.OrderItemsPageModule)
    },
    {
        path: 'orderitems/create',
        loadChildren: () => import('./order-item-create/order-item-create.module').then(m => m.OrderItemCreatePageModule)
    },
    {
        path: 'orderitems/:orderItemId',
        loadChildren: () => import('./order-item-detail/order-item-detail.module').then(m => m.OrderItemDetailPageModule)
    },
    {
        path: 'orderitems/:orderItemId/edit',
        loadChildren: () => import('./order-item-detail-edit/order-item-detail-edit.module').then(m => m.OrderItemDetailEditPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderDetailPageRoutingModule {
}
