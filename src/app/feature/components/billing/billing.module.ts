import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BillingComponent } from './billing.component';
import { PaymentModule } from '../payment/payment.module';
import { FormsModule } from '@angular/forms';
const DECLARATIONS = [BillingComponent];

const MODULES = [CommonModule, PaymentModule, FormsModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class BillingModule {}
