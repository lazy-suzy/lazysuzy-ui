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

import { AllProductsComponent } from './all-products.component';
import { ProductMobileModule } from '../../components/product-mobile/product-mobile.module';
import { ProductFilterMobileModule } from '../../components/product-filter-mobile/product-filter-mobile.module';
import { ProductSortMobileModule } from '../../components/product-sort-mobile/product-sort-mobile.module';

const DECLARATIONS = [AllProductsComponent];

const MODULES = [
  CommonModule,
  ProductModule,
  ProductFiltersModule,
  SortTypeModule,
  MatToolbarModule,
  MatIconModule,
  InfiniteScrollModule,
  ProductMobileModule,
  ProductFilterMobileModule,
  ProductSortMobileModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class AllProductsModule {}
