import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDetailsRoutingModule } from './order-details-routing.module';
import { OrderDetailsLoginComponent } from './order-details-login/order-details-login.component';
import {ReactiveFormsModule} from '@angular/forms';
import { OrderDetailsViewComponent } from './order-details-view/order-details-view.component';
import { OrderDetailsDesktopComponent } from './order-details-desktop/order-details-desktop.component';
import { OrderDetailsMobileComponent } from './order-details-mobile/order-details-mobile.component';


@NgModule({
  declarations: [OrderDetailsLoginComponent, OrderDetailsViewComponent, OrderDetailsDesktopComponent, OrderDetailsMobileComponent],
  imports: [
    CommonModule,
    OrderDetailsRoutingModule,
    ReactiveFormsModule
  ]
})
export class OrderDetailsModule { }
