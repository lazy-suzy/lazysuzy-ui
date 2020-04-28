import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';
const DECLARATIONS = [PaymentComponent];

const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class PaymentModule {}
