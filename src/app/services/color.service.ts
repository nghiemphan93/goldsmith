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
}
