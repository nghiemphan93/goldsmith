import {Injectable} from '@angular/core';
import {Customer} from '../models/customer';
import {BehaviorSubject, Observable} from 'rxjs';
import {CustomerService} from './customer.service';
import {AuthService} from './auth.service';
import {filter, switchMap, takeUntil} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CustomerCacheService {
    customersCache: Customer[];
    customersSubject: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>(null);

    constructor(private customerService: CustomerService,
                private authService: AuthService) {
        console.log('customer cache service created...');
    }

    /**
     * Return an Observable stream of Customers
     * Check firstly from Cache, if not exists -> make another HTTP Call
     */
    getCustomersCache$(): Observable<Customer[]> {
        if (this.customersCache) {
            console.log('Customers cache available...');
            return this.customersSubject.asObservable();
        } else {
            console.log('make HTTP call to get Customers');
            try {
                this.customerService.getCustomers().pipe(
                    takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))))
                    .subscribe(customersFromServer => {
                        this.customersCache = customersFromServer;
                        this.customersSubject.next(this.customersCache);
                    });
                return this.customersSubject.asObservable();
            } catch (e) {
                console.log(e);
            }
        }
    }

    /**
     * Clear Customers Cache
     */
    clearCustomersCache(): void {
        this.customersCache = null;
    }
}
