import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const DECLARATIONS = [PaymentComponent];

const MODULES = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class PaymentModule {}
