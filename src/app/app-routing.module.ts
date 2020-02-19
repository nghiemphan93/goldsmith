import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'orders/934tU103Z6fuuB9WPKWK/orderItems',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
    },
    {
        path: 'list',
        loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
    },
    {
        path: 'demo-table',
        loadChildren: () => import('./pages/demo-table/demo-table.module').then(m => m.DemoTablePageModule)
    },
    {
        path: 'products',
        loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule)
    },
    {
        path: 'products/create',
        loadChildren: () => import('./pages/product-create/product-create.module').then(m => m.ProductCreatePageModule)
    },
    {
        path: 'products/:productId',
        loadChildren: () => import('./pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule)
    },
    {
        path: 'products/:productId/edit',
        loadChildren: () => import('./pages/product-detail-edit/product-detail-edit.module').then(m => m.ProductDetailEditPageModule)
    },

    {
        path: 'customers',
        loadChildren: () => import('./pages/customers/customers.module').then(m => m.CustomersPageModule)
    },
    {
        path: 'customers/create',
        loadChildren: () => import('./pages/customer-create/customer-create.module').then(m => m.CustomerCreatePageModule)
    },
    {
        path: 'customers/:customerId',
        loadChildren: () => import('./pages/customer-detail/customer-detail.module').then(m => m.CustomerDetailPageModule)
    },
    {
        path: 'customers/:customerId/edit',
        loadChildren: () => import('./pages/customer-detail-edit/customer-detail-edit.module').then(m => m.CustomerDetailEditPageModule)
    },
    {
        path: 'orders',
        loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersPageModule)
    },
    {
        path: 'orders/create',
        loadChildren: () => import('./pages/order-create/order-create.module').then(m => m.OrderCreatePageModule)
    },
    {
        path: 'orders/:orderId/edit',
        loadChildren: () => import('./pages/order-detail-edit/order-detail-edit.module').then(m => m.OrderDetailEditPageModule)
    },
    {
        path: 'orders/:orderId',
        loadChildren: () => import('./pages/order-detail/order-detail.module').then(m => m.OrderDetailPageModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
