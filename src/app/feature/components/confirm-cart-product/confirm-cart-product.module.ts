import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmCartProductComponent } from './confirm-cart-product.component';
import { RouterModule } from '@angular/router';

const DECLARATIONS = [ConfirmCartProductComponent];

const MODULES = [CommonModule,RouterModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class ConfirmCartProductModule {}