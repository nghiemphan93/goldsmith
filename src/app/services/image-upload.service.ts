import {Injectable} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {ProductService} from './product.service';
import {FormBuilder} from '@angular/forms';
import {ToastService} from './toast.service';


@Injectable({
    providedIn: 'root'
})
export class ImageUploadService {

    constructor(private angularFireStorage: AngularFireStorage,
                private toastService: ToastService
    ) {
        console.log('image upload service created...');
    }

    /**
     * Update product's image to Firebase Storage
     * @param event: FileList
     */
    async uploadProductImage(event: FileList) {
        if (event.length <= 0) {
            return null;
        }

        // The File object
        const file = event.item(0);

        // Validation for Images Only
        if (file.type.split('/')[0] !== 'image') {
            console.error('unsupported file type :( ');
            return null;
        }

        const path = `productImages/${new Date().getTime()}_${file.name}`;

        // Totally optional metadata
        const customMetadata = {app: 'Product Image'};

        // File reference
        const fileRef = this.angularFireStorage.ref(path);

        try {
            const uploadTask = await fileRef.put(file, {customMetadata});
            const imageUrl = await fileRef.getDownloadURL().toPromise();

            // this.newProduct.imageUrl = imageUrl;
            return imageUrl;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Upload Order Item's Image to Firebase Storage
     * @param files: File List
     */
    async uploadOrderItemImage(files: FileList) {
        if (files.length <= 0) {
            return null;
        }

        // The File object
        const file = files.item(0);

        // Validation for Images Only
        if (file.type.split('/')[0] !== 'image') {
            console.error('unsupported file type :( ');
            return null;
        }

        const path = `orderItemImages/${new Date().getTime()}_${file.name}`;

        // Totally optional metadata
        const customMetadata = {app: 'Order Item Image'};

        // File reference
        const fileRef = this.angularFireStorage.ref(path);

        try {
            const uploadTask = await fileRef.put(file, {customMetadata});
            const imageUrl = await fileRef.getDownloadURL().toPromise();
            await this.toastService.presentToastSuccess(`Uploaded image ${file.name} successfully...`);
            return imageUrl;
        } catch (e) {
            console.log(e);
            await this.toastService.presentToastError(e.message);
        }
    }

    /**
     * Delete Image given URL from Firebase Storage
     * @param imageUrl: string
     */
    async deleteImageFromUrl(imageUrl: string) {
        try {
            return await this.angularFireStorage.storage.refFromURL(imageUrl).delete();
            await this.toastService.presentToastSuccess('Deleted image successfully...');
        } catch (e) {
            console.log(e);
            await this.toastService.presentToastError(e.message);
        }
    }
}
