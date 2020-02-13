import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FileUploadDemoPage } from './file-upload-demo.page';

const routes: Routes = [
  {
    path: '',
    component: FileUploadDemoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileUploadDemoPageRoutingModule {}
