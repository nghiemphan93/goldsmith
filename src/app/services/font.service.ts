import {Injectable} from '@angular/core';
import {IonSelect} from '@ionic/angular';

// tslint:disable-next-line:max-line-length
const embeddedFonts = ['A little sunshine', 'Amsterdam One', 'Angelface', 'Apple Chancery', 'Arial', 'Bookman Old Style', 'Bradley Hand', 'Brotherhood Script', 'Callie Hand', 'Candlescript', 'Caviar Dreams', 'Century Gothic', 'Chloe Regular', 'Colonna MT', 'Copperplate', 'Cosmopolitan Script', 'Courier Normal Regular', 'Dancing Script OT', 'Desyrel', 'Edwardian Script ITC', 'Enchanted Land', 'English Towne', 'Gabriola', 'Gautreaux Medium', 'Grand Hotel', 'Great Vibes', 'HaloHandletter', 'Honeyquick', 'Isabella Script', 'Jenna Sue', 'Lauren Script', 'Lavanderia Regular', 'Little Days Alt', 'Little Days', 'Lobster 14', 'Love', 'Lucida Calligraphy', 'Lucida Handwriting', 'Maratre', 'Money Penny Script', 'Monogram', 'Monotype Corsiva', 'Mulberry Script', 'Murray Hill', 'Nella Sue Demo', 'Quiska', 'Rochester', 'Script MT', 'Scriptina', 'Sofia', 'Times New Roman', 'Tox Typewriter', 'Wildmoon'];

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
        console.log('font service created...');
    }

    /**
     * Generate Font css Classes from Font Names
     */
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

    /**
     * Return css font class given font name
     * @param fontName: string
     */
    getFontClass(fontName: string) {
        let className = fontName.replace(/\s/g, '');
        className = className.replace('.', '');
        const fontClass = {};
        fontClass[className] = true;
        return fontClass;
    }
}
