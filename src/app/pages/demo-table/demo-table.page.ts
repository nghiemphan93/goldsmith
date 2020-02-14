import {Component, OnInit} from '@angular/core';

// import {ColumnMode} from '../../../../swimlane/ngx-datatable/src/public-api';
import data from './company.json';
import {Config, Platform} from '@ionic/angular';


@Component({
    selector: 'app-demo-table',
    templateUrl: './demo-table.page.html',
    styleUrls: ['./demo-table.page.scss'],
})
export class DemoTablePage implements OnInit {
    companies = data;
    tableStyle = 'material';

    constructor(private config: Config,
                private platform: Platform) {

    }

    ngOnInit() {
        this.createImgUrls();
        // console.log(this.companies);
        console.log(this.config.get('mode'));
        console.log(this.platform.platforms());
    }

    async open(row) {
        console.log(row);
    }

    createImgUrls() {
        this.companies.forEach(company => {
            // @ts-ignore
            company.imageUrl = this.generateRandomImgURL();
        });
    }

    /**
     * Generate random images url for each article
     */
    generateRandomImgURL(): string {
        const randomResolution = `${Math.floor(Math.random() * 100) + 200}x${Math.floor(Math.random() * 100) + 200}`;
        return `https://source.unsplash.com/${randomResolution}/?watch`;
    }
}
