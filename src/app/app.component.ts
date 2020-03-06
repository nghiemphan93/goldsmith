import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {of} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    isAuth$ = this.authService.getIsAuth$();

    public appPages = [
        {
            title: 'Products',
            url: '/products',
            icon: 'pricetag-outline'
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
            icon: 'receipt-outline'
        },
        {
            title: 'Create Order',
            url: '/orders/create',
            icon: 'create-outline'
        }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private authService: AuthService,
        private router: Router,
        private afs: AngularFirestore
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
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
