import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {FileUploadDemoPageRoutingModule} from './file-upload-demo-routing.module';

import {FileUploadDemoPage} from './file-upload-demo.page';
import {FileSizeFormatPipe} from './file-size-format-pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FileUploadDemoPageRoutingModule
    ],
    declarations: [FileUploadDemoPage, FileSizeFormatPipe]
})
export class FileUploadDemoPageModule {
}
