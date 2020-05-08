import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  LandingModule,
  ProductsModule,
  SearchModule,
  WishlistModule,
  AllProductsModule,
  CategoriesModule,
  CartModule
} from './containers';
import { AmericanNumberPipe } from '../shared/pipes/american-number.pipe';

import {
  ProductDetailsMobileModule,
  PaymentModule,
  OrderSuccessModule
} from './components';

// import { BlogModule } from './blog/blog/blog.module';

const DECLARATIONS = [];

const MODULES = [
  CommonModule,
  ProductsModule,
  LandingModule,
  SearchModule,
  WishlistModule,
  AllProductsModule,
  CategoriesModule,
  ProductDetailsMobileModule,
  CartModule,
  PaymentModule,
  OrderSuccessModule
  // BlogModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  // providers: [AmericanNumberPipe],
  exports: [...DECLARATIONS, ...MODULES]
})
export class FeatureModule {}
