import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private toastController: ToastController) {
    }

    async presentToastSuccess(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 4000,
            color: 'success'
        });
        await toast.present();
    }

    async presentToastError(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 4000,
            color: 'danger'
        });
        await toast.present();
    }
}
