import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CartComponent } from './cart.component';
import { CartProductsModule } from '../../components';
const DECLARATIONS = [CartComponent];

const MODULES = [CommonModule, CartProductsModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class CartModule {}
