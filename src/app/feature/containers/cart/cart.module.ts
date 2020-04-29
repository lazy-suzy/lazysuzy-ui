import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CartComponent } from './cart.component';
import { PaymentModule } from '../../components';
import { RouterModule } from '@angular/router';

const DECLARATIONS = [CartComponent];

const MODULES = [CommonModule, PaymentModule, RouterModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class CartModule {}
