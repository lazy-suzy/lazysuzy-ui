import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  LandingModule,
  ProductsModule,
  SearchModule,
  WishlistModule,
  CategoriesComponent
} from './containers';
import { AllProductsComponent } from './containers/all-products/all-products.component';
import { ProductDetailsMobileComponent } from './components/product-details-mobile/product-details-mobile.component';

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
    ProductDetailsMobileComponent
  ],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class FeatureModule {}
