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
import { BlogModule } from './blog/blog/blog.module';

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
  BlogModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class FeatureModule {}
