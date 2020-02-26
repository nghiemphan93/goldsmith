import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
// import {} from '../'


// // @ts-ignore
// $ionicNativeTransitionsProvider.enable(true);
// // @ts-ignore
// $ionicNativeTransitionsProvider.setDefaultOptions({
//     duration: 400, // in milliseconds (ms), default 400
// });
// // @ts-ignore
// $ionicNativeTransitionsProvider.setDefaultTransition({
//     type: 'slide',
//     direction: 'left'
// });
// // @ts-ignore
// $ionicNativeTransitionsProvider.setDefaultBackTransition({
//     type: 'slide',
//     direction: 'right'
// });
//
// // @ts-ignore
// if (ionic.Platform.isAndroid()) {
//     // @ts-ignore
//     $ionicConfigProvider.scrolling.jsScrolling(false);
// }


if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
