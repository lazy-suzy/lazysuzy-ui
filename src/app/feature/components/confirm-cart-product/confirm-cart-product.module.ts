import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmCartProductComponent } from './confirm-cart-product.component';
const DECLARATIONS = [ConfirmCartProductComponent];

const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class ConfirmCartProductModule {}
