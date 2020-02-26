import {Injectable} from '@angular/core';
import {Color} from '../models/color.enum';
import {IonSelect} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    colors: (string | Color)[] = Object.entries(Color).filter(e => !isNaN(e[0] as any)).map(e => e[1]);

    constructor() {
    }

    /**
     * Return color array from Color Enum
     */
    getColors() {
        return this.colors;
    }

    changeColor(orderItemColorElement: IonSelect) {
        // console.log(orderItemColorElement.value)
        switch (orderItemColorElement.value) {
            case 'SILVER':
                // this.selectedColorClass = 'silverColor';
                return {'background-color': 'white'};
                break;
            case 'PLATINUM':
                // this.selectedColorClass = 'platinumColor';
                return {'background-color': '#e5e4e2'};
                break;
            case 'GOLD':
                // this.selectedColorClass = 'goldColor';
                return {'background-color': 'yellow'};
                break;
            case 'ROSE GOLD':
                // this.selectedColorClass = 'roseGoldColor';
                return {'background-color': '#ffbcd2'};
                break;
        }
    }

    /**
     * Return css color class given color name
     * @param colorName: string
     */
    getColorClass(colorName: string) {
        const className = colorName.replace(/\s/g, '');
        const colorClass = {};
        colorClass[className] = true;
        return colorClass;
    }
}
