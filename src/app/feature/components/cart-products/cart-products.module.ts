import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CartProductsComponent } from './cart-products.component';
const DECLARATIONS = [CartProductsComponent];

const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class CartProductsModule {}
