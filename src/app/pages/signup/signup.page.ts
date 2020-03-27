import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastService} from '../../services/toast.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
    validationForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private authService: AuthService,
                private router: Router,
                private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.prepareFormValidation();
    }

    /**
     * Prepare a Reactive Form for Creating an User
     */
    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            email: new FormControl('', Validators.compose([
                Validators.pattern(/^[a-zA-Z]{1,}[0-9]?([\.\_-]? [a-zA-Z0-9]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
                Validators.required])),
            password: new FormControl('', Validators.required)
        });
    }

    /**
     * Handler Sign Up button
     */
    async signUpHandler() {
        const email = this.validationForm.value.email;
        const password = this.validationForm.value.password;

        try {
            const userCredential = await this.authService.signUp(email, password);
            await this.router.navigate(['orders']);
            await this.toastService.presentToastSuccess(`${userCredential.user.email} successfully created`);
        } catch (e) {
            console.log(e);
            await this.toastService.presentToastError(e.message);
        }

    }
}
