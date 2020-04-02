import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {OrderDetailPage} from './order-detail.page';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';
import {devOrAdminOrModOnly} from '../../app-routing.module';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'orderItems',
        pathMatch: 'full'
    },
    {
        path: 'orderItems',
        loadChildren: () => import('./order-items/order-items.module').then(m => m.OrderItemsPageModule)
    },
    {
        path: 'orderItems/create',
        loadChildren: () => import('./order-item-create/order-item-create.module').then(m => m.OrderItemCreatePageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: devOrAdminOrModOnly}
    },
    {
        path: 'orderItems/:orderItemId',
        loadChildren: () => import('./order-item-detail/order-item-detail.module').then(m => m.OrderItemDetailPageModule)
    },
    {
        path: 'orderItems/:orderItemId/edit',
        loadChildren: () => import('./order-item-detail-edit/order-item-detail-edit.module').then(m => m.OrderItemDetailEditPageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: devOrAdminOrModOnly}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderDetailPageRoutingModule {
}
