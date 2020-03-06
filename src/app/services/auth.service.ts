import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import UserCredential = firebase.auth.UserCredential;
import {BehaviorSubject, Observable, pipe, Subject, Subscription} from 'rxjs';
import {Unsubscribe, User} from 'firebase';
import {switchMap} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isAuthSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isAuth$: Observable<boolean> = this.isAuthSubject.asObservable();
    user: User;
    userSubject = new BehaviorSubject<User>(null);
    user$: Observable<User> = this.userSubject.asObservable();

    constructor(public auth: AngularFireAuth) {
        console.log('auth service created...');
        this.listenToAuthStateChange();
    }

    /**
     * Listen to Auth State Change
     * Emit new State to this.isAuth$ and this.user$
     */
    listenToAuthStateChange() {
        this.auth.auth.onAuthStateChanged(user => {
            if (user) {
                this.user = user;
                this.userSubject.next(this.user);
                this.isAuthSubject.next(true);
                console.log('user logged in: ' + this.user.email);
            } else {
                this.user = null;
                this.userSubject.next(this.user);
                this.isAuthSubject.next(false);
                console.log('user logged out... ');
            }
        });
    }

    getUser$(): Observable<User> {
        return this.user$;
    }

    getIsAuth$(): Observable<boolean> {
        return this.isAuth$;
    }

    async signUp(email: string, password: string): Promise<UserCredential> {
        return await this.auth.auth.createUserWithEmailAndPassword(email, password);
    }

    async signIn(email: string, password: string): Promise<UserCredential> {
        return await this.auth.auth.signInWithEmailAndPassword(email, password);
    }

    async signOut() {
        return await this.auth.auth.signOut();
    }
}
