import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../models/product';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {ImageUploadService} from '../../services/image-upload.service';

@Component({
    selector: 'app-product-detail-edit',
    templateUrl: './product-detail-edit.page.html',
    styleUrls: ['./product-detail-edit.page.scss'],
})
export class ProductDetailEditPage implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }
}
