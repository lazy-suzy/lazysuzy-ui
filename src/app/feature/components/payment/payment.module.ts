import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';
import { MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
const DECLARATIONS = [PaymentComponent];

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  MatIconModule,
  SharedModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class PaymentModule {}
