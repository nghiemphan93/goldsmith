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

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private alertController: AlertController,
                private orderItemService: OrderItemService,
                private orderService: OrderService,
                private customerService: CustomerService,
                private productService: ProductService,
                private toastService: ToastService
    ) {
    }

    async presentDeleteConfirm(toDeleteObject: OrderItem | Order | Customer | Product) {
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

    private async deleteObjectHelper(toDeleteObject: OrderItem | Order | Customer | Product) {
        try {
            if (toDeleteObject instanceof OrderItem) {
                const toDeleteOrderItem = toDeleteObject as OrderItem;
                await this.orderItemService.deleteOrderItem(toDeleteOrderItem.order.id, toDeleteOrderItem);
                await this.toastService.presentToastSuccess(`Successfully deleted Order Item ${toDeleteOrderItem.orderItemCode} from Order ${toDeleteOrderItem.order.orderCode}`);
            }
            if (toDeleteObject instanceof Order) {
                const toDeleteOrder = toDeleteObject as Order;
                await this.orderService.deleteOrder(toDeleteOrder);
                await this.toastService.presentToastSuccess(`Successfully deleted Order ${toDeleteOrder.orderCode}`);
            }
            if (toDeleteObject instanceof Customer) {
                const toDeleteCustomer = toDeleteObject as Customer;
                await this.customerService.deleteCustomer(toDeleteCustomer);
                await this.toastService.presentToastSuccess(`Successfully deleted Customer ${toDeleteCustomer.firstName} ${toDeleteCustomer.lastName}`);
            }
            if (toDeleteObject instanceof Product) {
                const toDeleteProduct = toDeleteObject as Product;
                await this.productService.deleteProduct(toDeleteProduct);
                await this.toastService.presentToastSuccess(`Successfully deleted Product ${toDeleteProduct.productName}`);
            }
        } catch (e) {
            console.log(e);
            await this.toastService.presentToastError(e.message);
        }
    }
}
