import {Injectable} from '@angular/core';
import {IonSelect} from '@ionic/angular';

// tslint:disable-next-line:max-line-length
const embeddedFonts = ['A little sunshine', 'Amsterdam One', 'Angelface', 'Apple Chancery', 'Arial', 'Bookman Old Style', 'Bradley Hand', 'Brotherhood Script', 'Callie Hand', 'Candlescript', 'Caviar Dreams', 'Century Gothic', 'Chloe Regular', 'Colonna MT', 'Copperplate', 'Cosmopolitan Script', 'Courier Normal Regular', 'Dancing Script OT', 'Edwardian Script ITC', 'English Towne', 'Gabriola', 'Gautreaux Medium', 'Grand Hotel', 'Great Vibes', 'HaloHandletter', 'Honeyquick', 'Isabella Script', 'Jenna Sue', 'Lauren Script', 'Lavanderia Regular', 'Little Days Alt', 'Little Days', 'Lobster 14', 'Lucida Calligraphy', 'Lucida Handwriting', 'Maratre', 'Money Penny Script', 'Monogram', 'Monotype Corsiva', 'Mulberry Script', 'Murray Hill', 'Nella Sue Demo', 'Quiska', 'Rochester', 'Script MT', 'Scriptina', 'Sofia', 'Times New Roman', 'Wildmoon'];

@Injectable({
    providedIn: 'root'
})
export class FontService {
    fontNames = embeddedFonts;
    fontClasses = embeddedFonts.map(fontName => {
        fontName = fontName.replace(/\s/g, '');
        fontName = fontName.replace('.', '');
        return fontName;
    });


    constructor() {
        // console.log(this.fontClasses);
        // this.generateFontClasses();
    }

    generateFontClasses() {
        for (let i = 0; i < this.fontNames.length; i++) {
            const fontClass = `.${this.fontClasses[i]} { font-family: ${this.fontNames[i]}; font-size: 3rem; }`;
            console.log(fontClass);
        }
    }

    getFontNames() {
        return this.fontNames;
    }

    getFontClasses() {
        return this.fontClasses;
    }

    changeFont(orderItemFontElement: IonSelect) {
        console.log(orderItemFontElement.value);
        return {
            'font-family': orderItemFontElement.value,
            'font-size': '2rem'
        };
    }

    getFontaClass(fontName: string) {
        // const fontClassIndex = this.fontNames.indexOf(fontName);
        // console.log(this.fontClasses[fontClassIndex]);
        return {Scriptina: true};
    }

    getFontClass({row, column, value}): any {
        let className = row.orderItemFont.replace(/\s/g, '');
        className = className.replace('.', '');
        const fontClass = {};
        fontClass[className] = true;
        return fontClass;
    }
}
