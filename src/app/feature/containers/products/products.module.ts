import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

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
  MatToolbarModule,
  MatIconModule,
  InfiniteScrollModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductsModule {}
