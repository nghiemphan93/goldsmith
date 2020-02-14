import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public appPages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'List',
            url: '/list',
            icon: 'list'
        },
        {
            title: 'Demo Table',
            url: '/demo-table',
            icon: 'videocam'
        },
        {
            title: 'Products',
            url: '/products',
            icon: 'pricetags'
        },
        {
            title: 'Create Product',
            url: '/products/create',
            icon: 'videocam'
        },
        {
            title: 'Customers',
            url: '/customers',
            icon: 'people-outline'
        },
        {
            title: 'Create Customer',
            url: '/customers/create',
            icon: 'person-add-outline'
        },
        {
            title: 'Orders',
            url: '/orders',
            icon: 'person-add-outline'
        },
        {
            title: 'Create Order',
            url: '/orders/create',
            icon: 'person-add-outline'
        }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
