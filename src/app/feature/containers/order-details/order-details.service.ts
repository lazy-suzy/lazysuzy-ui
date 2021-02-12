import {Injectable} from '@angular/core';
import {ApiService} from '../../../shared/services';
import {OrderDetailsInterface} from './OrderDetails.interface';

@Injectable({
    providedIn: 'root'
})
export class OrderDetailsService {
    orderDetails: OrderDetailsInterface = {
        status: false,
        data: [],
    };

    constructor(
        private apiService: ApiService
    ) {
    }

    // set Order Details
    setOrderDetails(value: OrderDetailsInterface) {
        this.orderDetails = value;
    }

    getOrderDetails(): OrderDetailsInterface {
        return this.orderDetails;
    }

    getOrderDetailsFromApi(orderNumber: string, zipCode: string) {
        return this.apiService.getOrderDetails(orderNumber, zipCode);
    }
}
