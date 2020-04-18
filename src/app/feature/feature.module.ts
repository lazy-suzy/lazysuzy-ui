import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  LandingModule,
  ProductsModule,
  SearchModule,
  WishlistModule,
  CategoriesComponent,
  AllProductsComponent
} from './containers';
import { AuthSuccessComponent, ProductDetailsMobileComponent } from './components';

const DECLARATIONS = [];

const MODULES = [
  CommonModule,
  ProductsModule,
  LandingModule,
  SearchModule,
  WishlistModule
];

@NgModule({
  declarations: [
    ...DECLARATIONS,
    CategoriesComponent,
    AllProductsComponent,
    ProductDetailsMobileComponent,
    AuthSuccessComponent,
  ],
  imports: [...MODULES],
exports: [...DECLARATIONS, ...MODULES]
})
export class FeatureModule {}
