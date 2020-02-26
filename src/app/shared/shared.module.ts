import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HideHeaderDirective} from '../directives/hide-header.directive';
import {HideHeaderBDirective} from '../directives/hide-header-b.directive';


@NgModule({
    declarations: [HideHeaderDirective, HideHeaderBDirective],
    exports: [HideHeaderDirective, HideHeaderBDirective],
    imports: [
        CommonModule
    ]
})
export class SharedModule {
}
