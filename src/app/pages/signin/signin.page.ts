import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.page.html',
    styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
    validationForm: FormGroup;
    error: string;

    constructor(private formBuilder: FormBuilder,
                private authService: AuthService,
                private router: Router,
                private afs: AngularFirestore
    ) {
    }

    ngOnInit() {
        this.prepareFormValidation();
    }

    /**
     * Prepare a Reactive Form for Signing In an User
     */
    prepareFormValidation() {
        this.validationForm = this.formBuilder.group({
            email: new FormControl('admin@goldsmith.com', Validators.compose([
                Validators.pattern(/^[a-zA-Z]{1,}[0-9]?([\.\_-]? [a-zA-Z0-9]+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
                Validators.required])),
            password: new FormControl('adminadmin', Validators.required)
        });
    }

    /**
     * Handler Sign In button
     */
    async signInHandler() {
        const email = this.validationForm.value.email;
        const password = this.validationForm.value.password;

        try {
            const userCredential = await this.authService.signIn(email, password);
            this.validationForm.reset();
            await this.router.navigate(['orders']);
        } catch (e) {
            console.log(e);
            this.error = e.message;
        }
    }
}
