import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AngularFireAuthGuard, redirectLoggedInTo} from '@angular/fire/auth-guard';

const redirectLoggedInToOrders = () => redirectLoggedInTo(['orders']);
const redirectLoggedInToCustomers = () => redirectLoggedInTo(['customers']);


const routes: Routes = [
    {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full'
    },
    {
        path: 'products',
        loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'products/create',
        loadChildren: () => import('./pages/product-create/product-create.module').then(m => m.ProductCreatePageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'products/:productId',
        loadChildren: () => import('./pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'products/:productId/edit',
        loadChildren: () => import('./pages/product-detail-edit/product-detail-edit.module').then(m => m.ProductDetailEditPageModule),
        canActivate: [AngularFireAuthGuard]
    },

    {
        path: 'customers',
        loadChildren: () => import('./pages/customers/customers.module').then(m => m.CustomersPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'customers/create',
        loadChildren: () => import('./pages/customer-create/customer-create.module').then(m => m.CustomerCreatePageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'customers/:customerId',
        loadChildren: () => import('./pages/customer-detail/customer-detail.module').then(m => m.CustomerDetailPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'customers/:customerId/edit',
        loadChildren: () => import('./pages/customer-detail-edit/customer-detail-edit.module').then(m => m.CustomerDetailEditPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'orders',
        loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'orders/create',
        loadChildren: () => import('./pages/order-create/order-create.module').then(m => m.OrderCreatePageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'orders/:orderId/edit',
        loadChildren: () => import('./pages/order-detail-edit/order-detail-edit.module').then(m => m.OrderDetailEditPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'orders/:orderId',
        loadChildren: () => import('./pages/order-detail/order-detail.module').then(m => m.OrderDetailPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'signup',
        loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: redirectLoggedInToOrders}
    },
    {
        path: 'signin',
        loadChildren: () => import('./pages/signin/signin.module').then(m => m.SigninPageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: redirectLoggedInToCustomers}
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
