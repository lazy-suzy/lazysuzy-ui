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
import { ProductDetailsMobileModule } from './components';
// import { BlogModule } from './blog/blog/blog.module';
import { OrderSuccessComponent } from './components/order-success/order-success.component';

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
  CartModule
  // BlogModule
];

@NgModule({
  declarations: [...DECLARATIONS, OrderSuccessComponent],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class FeatureModule {}
