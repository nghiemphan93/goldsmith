import {Injectable} from '@angular/core';
import {Color} from '../models/color.enum';
import {IonSelect} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    colors: (string | Color)[] = Object.entries(Color).filter(e => !isNaN(e[0] as any)).map(e => e[1]);

    constructor() {
        console.log('color service created...');
    }

    /**
     * Return color array from Color Enum
     */
    getColors() {
        return this.colors;
    }

    /**
     * Return css color class given color name
     * @param colorName: string
     */
    getColorClass(colorName: string | Color) {
        const className = colorName.toString().replace(/\s/g, '');
        const colorClass = {};
        colorClass[className] = true;
        return colorClass;
    }
}
