import {Injectable} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {OrderItem} from '../models/orderitem';
import {Order} from '../models/order';
import {Customer} from '../models/customer';
import {Product} from '../models/product';
import {OrderItemService} from './order-item.service';
import {OrderService} from './order.service';
import {CustomerService} from './customer.service';
import {ProductService} from './product.service';
import {ToastService} from './toast.service';
import {User} from 'firebase';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private alertController: AlertController,
                private orderItemService: OrderItemService,
                private orderService: OrderService,
                private customerService: CustomerService,
                private productService: ProductService,
                private toastService: ToastService,
                private authService: AuthService
    ) {
    }

    async presentDeleteConfirm(toDeleteObject: OrderItem | Order | Customer | Product | User) {
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
                        this.deleteObjectHelper(toDeleteObject);
                    }
                }
            ]
        });
        await alert.present();
    }

    private async deleteObjectHelper(toDeleteObject: OrderItem | Order | Customer | Product | User) {
        try {
            if (toDeleteObject.hasOwnProperty('orderItemCode')) {
                const toDeleteOrderItem = toDeleteObject as OrderItem;
                const result = await this.orderItemService.deleteOrderItem(toDeleteOrderItem.order.id, toDeleteOrderItem);
                await this.toastService.presentToastSuccess(`Successfully deleted Order Item ${toDeleteOrderItem.orderItemCode} from Order ${toDeleteOrderItem.order.orderCode}`);
            }
            if (toDeleteObject.hasOwnProperty('orderCode')) {
                const toDeleteOrder = toDeleteObject as Order;
                await this.orderService.deleteOrder(toDeleteOrder);
                await this.toastService.presentToastSuccess(`Successfully deleted Order ${toDeleteOrder.orderCode}`);
            }
            if (toDeleteObject.hasOwnProperty('firstName')) {
                const toDeleteCustomer = toDeleteObject as Customer;
                await this.customerService.deleteCustomer(toDeleteCustomer);
                await this.toastService.presentToastSuccess(`Successfully deleted Customer ${toDeleteCustomer.firstName} ${toDeleteCustomer.lastName}`);
            }
            if (toDeleteObject.hasOwnProperty('productName')) {
                const toDeleteProduct = toDeleteObject as Product;
                await this.productService.deleteProduct(toDeleteProduct);
                await this.toastService.presentToastSuccess(`Successfully deleted Product ${toDeleteProduct.productName}`);
            }
            if ('email' in toDeleteObject) {
                const toDeleteUser = toDeleteObject as User;
                await this.authService.deleteUserByAdmin(toDeleteUser.email);
                console.log(toDeleteUser);
                await this.toastService.presentToastSuccess(`Successfully deleted User ${toDeleteUser.email}`);
            }
        } catch (e) {
            console.log(e);
            await this.toastService.presentToastError(e.message);
        }
    }
}
