import {Injectable} from '@angular/core';
import {Claim} from '../models/claim.enum';
import {User} from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class ClaimService {
    claims: (string | Claim)[] = Object.entries(Claim).map(e => e[1]);

    constructor() {
        console.log('claim service created...');
    }

    /**
     * Return status array from Status Enum
     */
    getClaims(): (string | Claim)[] {
        return this.claims;
    }

    claimEnumToBoolean(claim: Claim) {
        switch (claim) {
            case Claim.DEV:
                return {DEV: true};
                break;
            case Claim.ADMIN:
                return {ADMIN: true};
                break;
            case Claim.MODERATOR:
                return {MODERATOR: true};
                break;
            case Claim.DESIGNER:
                return {DESIGNER: true};
                break;
        }
    }

    claimBooleanToEnum(user: any | User) {
        if (user.customClaims.DEV === true) {
            return Claim.DEV;
        }
        if (user.customClaims.ADMIN === true) {
            return Claim.ADMIN;
        }
        if (user.customClaims.MODERATOR === true) {
            return Claim.MODERATOR;
        }
        if (user.customClaims.DESIGNER === true) {
            return Claim.DESIGNER;
        }
    }
}
