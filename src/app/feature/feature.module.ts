import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  LandingModule,
  ProductsModule,
  SearchModule,
  WishlistModule,
  AllProductsModule,
  CategoriesModule
} from './containers';
import { ProductDetailsMobileModule } from './components';
import { BlogModule } from './blog/blog/blog.module';
import { AuthContainerComponent } from './containers/auth-container/auth-container.component';

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
  BlogModule,
  AuthContainerComponent
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class FeatureModule {}
