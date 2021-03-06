import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SubscribeModule } from '../../components/subscribe/subscribe.module';
import {
  ProductFiltersModule,
  ProductModule,
  SortTypeModule
} from './../../components';

import { ProductsComponent } from './products.component';
import { ProductMobileModule } from '../../components/product-mobile/product-mobile.module';
import { ProductFilterMobileModule } from '../../components/product-filter-mobile/product-filter-mobile.module';
import { ProductSortMobileModule } from '../../components/product-sort-mobile/product-sort-mobile.module';
import { BrandListModule } from '../../components/brand-list/brand-list.module';
import {CollectionListModule} from "../../components/collection-list/collection-list.module";

const DECLARATIONS = [ProductsComponent];

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
  ProductSortMobileModule,
  BrandListModule,
  SubscribeModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES, CollectionListModule],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductsModule {}
