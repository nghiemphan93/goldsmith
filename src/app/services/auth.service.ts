import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from 'firebase';
import {AngularFireFunctions} from '@angular/fire/functions';
import {Claim} from '../models/claim.enum';
import UserCredential = firebase.auth.UserCredential;


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isAuthSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isAuth$: Observable<boolean> = this.isAuthSubject.asObservable();
    user: any;
    userSubject = new BehaviorSubject<User>(null);
    user$: Observable<User> = this.userSubject.asObservable();

    constructor(public auth: AngularFireAuth,
                private angularFireFunctions: AngularFireFunctions
    ) {
        console.log('auth service created...');
        this.listenToAuthStateChange();
    }

    /**
     * Listen to Auth State Change
     * Emit new State to this.isAuth$ and this.user$
     */
    listenToAuthStateChange() {
        this.auth.auth.onAuthStateChanged(async user => {
            if (user) {
                this.user = user;
                const idTokenResult = await this.user.getIdTokenResult();
                // @ts-ignore
                this.user.customClaims = idTokenResult.claims;
                this.userSubject.next(this.user);
                this.isAuthSubject.next(true);
                console.log('user logged in: ' + this.user.email);
                console.log(this.user);
            } else {
                this.user = null;
                this.userSubject.next(this.user);
                this.isAuthSubject.next(false);
                console.log('user logged out... ');
            }
        });
    }

    createUserByAdmin(user: any) {
        return this.angularFireFunctions
            .httpsCallable('createUser')({user})
            .toPromise();
    }

    getCurentUser$(): Observable<any> {
        return this.user$;
    }

    getIsAuth$(): Observable<boolean> {
        return this.isAuth$;
    }

    makeDev(email: string) {
        return this.angularFireFunctions
            .httpsCallable('makeDev')({email})
            .toPromise();
    }

    makeAdmin(email: string) {
        return this.angularFireFunctions
            .httpsCallable('makeAdmin')({email})
            .toPromise();
    }

    makeModerator(email: string) {
        return this.angularFireFunctions
            .httpsCallable('makeModerator')({email})
            .toPromise();
    }

    makeDesigner(email: string) {
        return this.angularFireFunctions
            .httpsCallable('makeDesigner')({email})
            .toPromise();
    }

    signUp(email: string, password: string): Promise<UserCredential> {
        return this.auth.auth.createUserWithEmailAndPassword(email, password);
    }

    signIn(email: string, password: string): Promise<UserCredential> {
        return this.auth.auth.signInWithEmailAndPassword(email, password);
    }

    signOut() {
        return this.auth.auth.signOut();
    }

    updatePasswordByAdmin(email: string, newPassword: string) {
        return this.angularFireFunctions
            .httpsCallable('updatePasswordByAdmin')({email, newPassword})
            .toPromise();
    }

    updateEmailByAdmin(email: string, newEmail: string) {
        return this.angularFireFunctions
            .httpsCallable('updateEmailByAdmin')({email, newEmail})
            .toPromise();
    }

    updateUserByAdmin(user: any | User) {
        return this.angularFireFunctions
            .httpsCallable('updateUserByAdmin')({user})
            .toPromise();
    }

    updateEmail(email: string, newEmail: string) {
        return this.user.updateEmail(newEmail);
    }

    updatePassword(email: string, newPassword: string) {
        return this.user.updatePassword(newPassword);
    }

    getAllUsersByAdmin(): Observable<User[]> {
        // @ts-ignore
        return this.angularFireFunctions
            .httpsCallable('getAllUsersByAdmin')();
    }

    deleteUserByAdmin(email: string) {
        return this.angularFireFunctions
            .httpsCallable('deleteUserByAdmin')({email})
            .toPromise();
    }

    getUserById(userId: string) {
        return this.angularFireFunctions
            .httpsCallable('getUserById')({userId})
            .toPromise();
    }
}
