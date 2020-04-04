import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    loading: HTMLIonLoadingElement;

    constructor(private loadingController: LoadingController) {
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            message: 'Please wait...',
            duration: 5000
        });
        await this.loading.present();
    }

    async dismissLoading() {
        await this.loading.dismiss();
    }
}
