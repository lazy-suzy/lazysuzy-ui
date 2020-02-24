import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductFiltersModule, ProductModule } from './../../components';
import { ProductsComponent } from './products.component';

const DECLARATIONS = [ProductsComponent];

const MODULES = [CommonModule, ProductModule, ProductFiltersModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class ProductsModule {}
