import {Component, OnDestroy} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {of} from 'rxjs';
import {OrderItemCacheService} from './services/order-item-cache.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy {
    isAuth$ = this.authService.getIsAuth$();
    user$ = this.authService.getCurentUser$();

    public appPages = [
        {
            title: 'Products',
            url: '/products',
            icon: 'pricetag-outline'
        },
        {
            title: 'Customers',
            url: '/customers',
            icon: 'people-outline'
        },
        {
            title: 'Orders',
            url: '/orders',
            icon: 'receipt-outline'
        },
        {
            title: 'Search Order Item',
            url: '/search/orderItem',
            icon: 'search-outline'
        }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private authService: AuthService,
        private router: Router,
        private afs: AngularFirestore,
        private orderItemCacheService: OrderItemCacheService
    ) {
        this.initializeApp();
        this.initServices();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    initServices() {
        this.orderItemCacheService.init();
    }

    async ngOnDestroy() {
        await this.authService.signOut();
        console.log('signing out...');
    }

    async signOutHandler() {
        try {
            await this.authService.signOut();
            await this.router.navigate(['signin']);
        } catch (e) {
            console.log(e);
        }
    }
}
