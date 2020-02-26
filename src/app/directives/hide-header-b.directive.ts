import {Directive, Input, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
    selector: '[appHideHeaderB]', // Attribute selector
  // tslint:disable-next-line:no-host-metadata-property
    host: {
        '(ionScroll)': 'onContentScroll($event)'
    }
})
export class HideHeaderBDirective implements OnInit {

    @Input() header: HTMLElement;
    @Input() footer: HTMLElement;

    constructor(public element: ElementRef, public renderer2: Renderer2) {
        console.log('Hello HideHeaderDirective Directive');
    }

    ngOnInit() {
        this.renderer2.setStyle(this.header, 'transition', 'top 700ms');
        this.renderer2.setStyle(this.footer, 'transition', 'bottom 700ms');
    }

    onContentScroll(event) {
        if (event.directionY === 'down') {
            this.renderer2.setStyle(this.header, 'top', '-56px');
            this.renderer2.setStyle(this.footer, 'bottom', '-56px');
        } else {
            this.renderer2.setStyle(this.header, 'top', '0px');
            this.renderer2.setStyle(this.footer, 'bottom', '0px');
        }
    }

}
