import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Ng5SliderModule } from 'ng5-slider';
import { ProductFiltersComponent } from './product-filters.component';

const DECLARATIONS = [ProductFiltersComponent];

const MODULES = [
  CommonModule,
  MatMenuModule,
  MatCheckboxModule,
  Ng5SliderModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductFiltersModule {}
