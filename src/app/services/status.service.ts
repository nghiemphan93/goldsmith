import {Injectable} from '@angular/core';
import {Status} from '../models/status.enum';

@Injectable({
    providedIn: 'root'
})
export class StatusService {
    statuses: (string | Status)[] = Object.entries(Status).filter(e => !isNaN(e[0] as any)).map(e => e[1]);

    constructor() {
        console.log('status service created...');
    }

    /**
     * Return status array from Status Enum
     */
    getStatuses(): (string | Status)[] {
        return this.statuses;
    }
}
