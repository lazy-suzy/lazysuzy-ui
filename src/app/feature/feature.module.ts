import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  LandingModule,
  ProductsModule,
  SearchModule,
  WishlistModule,
  AllProductsModule,
  CategoriesModule,
  CartModule,
  ForgotPasswordModule,
  ResetPasswordModule
} from './containers';
import { AmericanNumberPipe } from '../shared/pipes/american-number.pipe';
import {
  ProductDetailsMobileModule,
  PaymentModule,
  OrderSuccessModule,
  ProfileModule,
  DisplayProfileModule
} from './components';
import { ResetPasswordComponent } from './containers/reset-password/reset-password.component';
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
  OrderSuccessModule,
  ForgotPasswordModule,
  ResetPasswordModule,
  ProfileModule,
  DisplayProfileModule
  // BlogModule
];
@NgModule({
  declarations: [...DECLARATIONS, ResetPasswordComponent],
  imports: [...MODULES],
  // providers: [AmericanNumberPipe],
  exports: [...DECLARATIONS, ...MODULES]
})
export class FeatureModule {}
