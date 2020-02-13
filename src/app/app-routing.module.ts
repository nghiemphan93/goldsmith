import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'products',
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
        path: 'demo-table',
        loadChildren: () => import('./pages/demo-table/demo-table.module').then(m => m.DemoTablePageModule)
    },
    {
        path: 'file-upload-demo',
        loadChildren: () => import('./pages/file-upload-demo/file-upload-demo.module').then(m => m.FileUploadDemoPageModule)
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
