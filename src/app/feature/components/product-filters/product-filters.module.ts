import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProductFiltersComponent } from './product-filters.component';

const DECLARATIONS = [ProductFiltersComponent];

const MODULES = [CommonModule, MatToolbarModule, MatMenuModule, MatCheckboxModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class ProductFiltersModule {}
