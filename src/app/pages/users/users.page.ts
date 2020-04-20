import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ProductService} from '../../services/product.service';
import {ImageUploadService} from '../../services/image-upload.service';
import {AlertController, Config, Platform} from '@ionic/angular';
import {Observable, Subscription} from 'rxjs';
import {Product} from '../../models/product';
import {User} from 'firebase';
import {UserService} from '../../services/user.service';
import {ClaimService} from '../../services/claim.service';
import {AlertService} from '../../services/alert.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {
    subscription = new Subscription();
    users$: Observable<User[] | any[]>;
    tableStyle = 'material';
    isDesktop: boolean;
    isMobile: boolean;
    skeletons = [1, 2];
    currentUser$: Observable<User | any>;

    constructor(private authService: AuthService,
                private platform: Platform,
                private alertController: AlertController,
                private userService: UserService,
                public claimService: ClaimService,
                public alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.preparePlatform();
        this.currentUser$ = this.authService.getCurrentUser$();
        this.users$ = this.userService.getUsers();
    }

    ngOnDestroy() {
        console.log('bye bye UserSPage...');
    }

    /**
     * Identify which platform is being used
     */
    private preparePlatform() {
        this.isDesktop = this.platform.is('desktop');
        this.isMobile = !this.platform.is('desktop');
    }

    /**
     * Showing alert when clicking Delete Button
     * @param toDeleteUser: User
     */
    async presentDeleteConfirm(toDeleteUser: User) {
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: '<strong>Are you sure to delete?</strong>!!!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('canceled');
                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        console.log('okay');
                        this.deleteUser(toDeleteUser);
                    }
                }
            ]
        });

        await alert.present();
    }

    /**
     * Handler to delete a User
     * @param toDeleteUser: User
     */
    async deleteUser(toDeleteUser: User) {
        console.log(toDeleteUser);
        try {
            const result = await this.authService.deleteUserByAdmin(toDeleteUser.email);
            console.log(result);
        } catch (e) {
            console.log(e);
        }

    }

}
