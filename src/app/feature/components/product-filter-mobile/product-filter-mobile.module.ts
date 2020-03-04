import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatButtonModule } from '@angular/material';
import { ProductFilterMobileComponent } from './product-filter-mobile.component';

const DECLARATIONS = [ProductFilterMobileComponent];
const MODULES = [CommonModule, MatIconModule, MatButtonModule];


@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
  ...MODULES
  ],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductFilterMobileModule { }
