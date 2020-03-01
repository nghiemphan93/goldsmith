import {Injectable} from '@angular/core';
import {Customer} from '../models/customer';
import {BehaviorSubject, Observable} from 'rxjs';
import {CustomerService} from './customer.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerCacheService {
    customerCache: Customer[];
    customerSubject: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>(null);

    constructor(private customerService: CustomerService) {
    }

    /**
     * Return an Observable stream of Customers
     * Check firstly from Cache, if not exists -> make another HTTP Call
     */
    getCustomersCache(): Observable<Customer[]> {
        if (this.customerCache) {
            console.log('Customers cache available...');
            return this.customerSubject.asObservable();
        } else {
            console.log('make HTTP call to get Customers');
            this.customerService.getCustomers().subscribe(customersFromServer => {
                this.customerCache = customersFromServer;
                this.customerSubject.next(this.customerCache);
            });
            return this.customerSubject.asObservable();
        }
    }

    /**
     * Clear Customers Cache
     */
    clearCustomersCache(): void {
        this.customerCache = null;
    }
}
