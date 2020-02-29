import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  LandingModule,
  ProductsModule,
  SearchModule,
  WishlistModule,
  CategoriesModule
} from './containers';

const DECLARATIONS = [];

const MODULES = [
  CommonModule,
  ProductsModule,
  LandingModule,
  SearchModule,
  WishlistModule,
  CategoriesModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class FeatureModule {}
