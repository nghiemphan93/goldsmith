import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AngularFireAuthGuard, customClaims, redirectLoggedInTo} from '@angular/fire/auth-guard';
import {pipe} from 'rxjs';
import {map} from 'rxjs/operators';

const redirectLoggedInToOrders = () => redirectLoggedInTo(['orders']);
const redirectLoggedInToCustomers = () => redirectLoggedInTo(['customers']);
const devOnly = () => pipe(customClaims, map(claims => claims.DEV === true));
const devOrAdminOnly = () => pipe(customClaims, map(claims => (claims.DEV === true) || (claims.ADMIN === true)));


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
        path: 'signin',
        loadChildren: () => import('./pages/signin/signin.module').then(m => m.SigninPageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: redirectLoggedInToCustomers}
    },
    {
        path: 'users',
        loadChildren: () => import('./pages/users/users.module').then(m => m.UsersPageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: devOrAdminOnly}
    },
    {
        path: 'users/create',
        loadChildren: () => import('./pages/user-create/user-create.module').then(m => m.UserCreatePageModule),
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: devOrAdminOnly}
    },
    {
        path: 'users/:userId',
        loadChildren: () => import('./pages/user-detail/user-detail.module').then(m => m.UserDetailPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'users/:userId/edit',
        loadChildren: () => import('./pages/user-detail-edit/user-detail-edit.module').then(m => m.UserDetailEditPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'search/orderItem',
        loadChildren: () => import('./pages/search-order-item/search-order-item.module').then(m => m.SearchOrderItemPageModule),
        canActivate: [AngularFireAuthGuard]
    },
    {
        path: 'search/customer',
        loadChildren: () => import('./pages/search-customer/search-customer.module').then(m => m.SearchCustomerPageModule),
        canActivate: [AngularFireAuthGuard]
    },


];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
