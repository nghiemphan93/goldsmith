import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Product} from '../../models/product';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from 'firebase';
import {ProductService} from '../../services/product.service';
import {ImageUploadService} from '../../services/image-upload.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ClaimService} from '../../services/claim.service';
import {startWith} from 'rxjs/operators';
import {Claim} from '../../models/claim.enum';
import {UserService} from '../../services/user.service';
import {IonButton} from '@ionic/angular';
import {ToastService} from '../../services/toast.service';

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.page.html',
    styleUrls: ['./user-create.page.scss'],
})
export class UserCreatePage implements OnInit, OnDestroy {
    subscription = new Subscription();
    user: any;
    validationForm: FormGroup;
    isCreated: boolean;
    isUpdated: boolean;
    isDetailed: boolean;
    claims: (string | Claim)[];
    error: string;
    currentUser$: Observable<User | any>;

    @ViewChild('submitButton') submitButton: ElementRef;

    constructor(private authService: AuthService,
                private formBuilder: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                public claimService: ClaimService,
                private userService: UserService,
                private toastService: ToastService,
    ) {
    }

    async ngOnInit() {
        await this.preparePageContent();
    }

    async ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Identify what purpose of the page should be.
     * Create, Edit or Detail of a Customer
     */
    async preparePageContent() {
        this.currentUser$ = this.authService.getCurentUser$();
        this.claims = this.claimService.getClaims();
        const userId = this.activatedRoute.snapshot.params.userId;
        const url = this.router.url.split('/');


        switch (url[url.length - 1]) {
            case 'create':
                this.isCreated = true;
                this.user = {};
                this.prepareFormValidationCreate();
                break;
            case 'edit':
                try {
                    this.isUpdated = true;
                    this.subscription.add(this.userService.getUser(userId).subscribe(userFromServer => {
                        this.user = userFromServer;
                        this.prepareFormValidationUpdateOrDetail();
                    }));
                } catch (e) {
                    console.log(e);
                }
                break;
            default :
                try {
                    this.isDetailed = true;
                    this.subscription.add(this.userService.getUser(userId).subscribe(userFromServer => {
                        this.user = userFromServer;
                        this.prepareFormValidationUpdateOrDetail();
                    }));
                } catch (e) {
                    console.log(e);
                }
                break;
        }
    }


    /**
     * Prepare a Reactive Form for Creating a User
     */
    prepareFormValidationCreate() {
        this.validationForm = this.formBuilder.group({
            displayName: new FormControl(''),
            email: new FormControl('', Validators.compose([
                Validators.pattern(/^[a-zA-Z]{1,}[0-9]?([\.\_-]? [a-zA-Z0-9]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
                Validators.required])),
            password: new FormControl('', Validators.required),
            customClaims: new FormControl(this.claims[3], Validators.required),
        });
    }

    /**
     * Prepare a Reactive Form for Editing or Showing Details of a User
     */
    prepareFormValidationUpdateOrDetail() {
        this.validationForm = this.formBuilder.group({
            displayName: new FormControl(this.user.displayName),
            email: new FormControl(this.user.email, Validators.compose([
                Validators.pattern(/^[a-zA-Z]{1,}[0-9]?([\.\_-]? [a-zA-Z0-9]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
                Validators.required])),
            password: new FormControl(this.user.password, Validators.required),
            customClaims: new FormControl(this.claimService.claimBooleanToEnum(this.user), Validators.required),
        });
    }

    /**
     * Handler Submit button
     */
    async submitHandler() {
        console.log(this.submitButton.nativeElement);
        this.user.displayName = this.validationForm.value.displayName;
        this.user.email = this.validationForm.value.email;
        this.user.password = this.validationForm.value.password;
        this.user.customClaims = this.claimService.claimEnumToBoolean(this.validationForm.value.customClaims);

        try {
            if (this.isCreated) {
                const result = await this.authService.createUserByAdmin(this.user);
                await this.toastService.presentToastSuccess(`${this.user.email} successfully created`);
            } else {
                const result = await this.authService.updateUserByAdmin(this.user);
                await this.toastService.presentToastSuccess(`${this.user.email} successfully updated`);
            }

            this.validationForm.reset();
            await this.router.navigate(['users']);
            window.dispatchEvent(new Event('resize'));
        } catch (e) {
            console.log(e);
            this.error = e.message;
            await this.toastService.presentToastError(e.message);
            window.dispatchEvent(new Event('resize'));
        }
    }

    /**
     * Helper to select data for <ion-select>
     * @param o1: Object
     * @param o2: Object
     */
    compareWithFn(o1, o2) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }

}
