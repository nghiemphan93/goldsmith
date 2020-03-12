import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference, QueryDocumentSnapshot} from '@angular/fire/firestore';
import {Customer} from '../models/customer';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {filter, map, takeUntil} from 'rxjs/operators';
import {User} from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    userCollection: AngularFirestoreCollection<User | any>;
    userDoc: AngularFirestoreDocument<User | any>;
    users: Observable<User[] | any[]>;
    user$: Observable<User | any>;

    constructor(private afs: AngularFirestore,
                private authService: AuthService) {
        this.userCollection = this.afs.collection('users', ref =>
            ref.orderBy('email', 'asc'));
    }

    /**
     * Return all Users from Database
     */
    getUsers(): Observable<User[] | any[]> {
        this.users = this.userCollection.snapshotChanges().pipe(
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
            map(actions => {
                console.log('-----------------------------------');
                actions.forEach(act => console.log(act.payload.doc.data().email + ' from cache=' + act.payload.doc.metadata.fromCache + ' type=' + act.payload.type));
                console.log('-----------------------------------');

                return actions.map(act => {
                    const data = act.payload.doc.data() as User | any;
                    data.uid = act.payload.doc.id;
                    return data;
                });
            })
        );
        return this.users;
    }

    /**
     * Return one User from Database given customerId
     * @param userId: string
     */
    getUser(userId: string): Observable<User | any> {
        this.userDoc = this.afs.doc<User | any>(`users/${userId}`);
        this.user$ = this.userDoc.snapshotChanges().pipe(
            takeUntil(this.authService.getIsAuth$().pipe(filter(isAuth => isAuth === false))),
            map(action => {
                if (action.payload.exists === false) {
                    return null;
                } else {
                    const data = action.payload.data() as User | any;
                    data.uid = action.payload.id;
                    return data;
                }
            })
        );
        return this.user$;
    }

    /**
     * Upload one new User to Database
     * @param user: Customer
     */
    createUser(user: User | any): Promise<DocumentReference> {
        const data = JSON.parse(JSON.stringify(user));
        return this.userCollection.add(data);
    }

    /**
     * Update one User to Database
     * @param toUpdateUser: Customer
     */
    updateCustomer(toUpdateUser: User | any) {
        this.userDoc = this.afs.doc(`users/${toUpdateUser.uid}`);
        return this.userDoc.update(toUpdateUser);
    }

    /**
     * Delete one User from Database
     * @param toDeleteUser: User
     */
    deleteUser(toDeleteUser: User | any) {
        this.userDoc = this.afs.doc(`users/${toDeleteUser.uid}`);
        return this.userDoc.delete();
    }
}
