import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import {
  ProductFiltersModule,
  ProductModule,
  SortTypeModule
} from './../../components';
import { ProductsComponent } from './products.component';

const DECLARATIONS = [ProductsComponent];

const MODULES = [
  CommonModule,
  ProductModule,
  ProductFiltersModule,
  SortTypeModule,
  MatToolbarModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductsModule {}
