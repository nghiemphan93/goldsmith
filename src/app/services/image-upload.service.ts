import {Injectable} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {ProductService} from './product.service';
import {FormBuilder} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ImageUploadService {

    constructor(private angularFireStorage: AngularFireStorage,
    ) {
    }

    async uploadProductImage(event: FileList): Promise<string> {
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

        // The storage path
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
}
