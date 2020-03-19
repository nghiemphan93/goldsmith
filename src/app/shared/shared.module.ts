import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HideHeaderDirective} from '../directives/hide-header.directive';
import {HideHeaderBDirective} from '../directives/hide-header-b.directive';
import {AutofocusDirective} from '../directives/autofocus.directive';


@NgModule({
    declarations: [HideHeaderDirective, HideHeaderBDirective, AutofocusDirective],
    exports: [HideHeaderDirective, HideHeaderBDirective, AutofocusDirective],
    imports: [
        CommonModule
    ]
})
export class SharedModule {
}
