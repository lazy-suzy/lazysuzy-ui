import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderDetailsService} from '../order-details.service';
import {UtilsService} from '../../../../shared/services';
import {OrderDetailsInterface} from '../OrderDetails.interface';
import {AuthGuardService} from '../../../../shared/services/auth/auth-guard.service';

@Component({
    selector: 'app-order-details-view',
    templateUrl: './order-details-view.component.html',
    styleUrls: ['./order-details-view.component.less']
})
export class OrderDetailsViewComponent implements OnInit {

    orderDetails: OrderDetailsInterface = {
        status: false,
        data: [],
    };
    isHandset = false;
    spinner = 'assets/image/spinner.gif';
    isLinkFetching = true;

    constructor(
        private route: ActivatedRoute,
        private orderDetailsService: OrderDetailsService,
        private utils: UtilsService,
        private authService: AuthGuardService,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.utils.isHandset().subscribe(handset => {
            this.isHandset = handset.matches;
        });
        const params = this.route.snapshot.queryParams;
        if (params && Object.keys(params).length) {
            this.orderDetails = this.orderDetailsService.getOrderDetails();
            if (!this.orderDetails.status) {
                this.setOrderDetailsFromApi(params);
            } else {
                this.isLinkFetching = false;
            }
        } else {
            if (this.authService.isGuest()) {
                this.router.navigate(['/order-details', 'authenticate']);
            } else {
                this.setOrderDetailsFromApi({});
            }
        }
    }

    private setOrderDetailsFromApi(params) {
        this.orderDetailsService.getOrderDetailsFromApi(params.orderNumber, params.zipCode).subscribe(
            (response: OrderDetailsInterface) => {
                this.orderDetails = response;
                this.isLinkFetching = false;
            }
        );
    }
}
