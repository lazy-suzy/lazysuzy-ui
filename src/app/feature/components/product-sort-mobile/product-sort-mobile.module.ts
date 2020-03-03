import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatButtonModule } from '@angular/material';
import { ProductSortMobileComponent } from './product-sort-mobile.component';

const DECLARATIONS = [ProductSortMobileComponent];
const MODULES = [CommonModule, MatIconModule, MatButtonModule];


@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
    ...MODULES
  ],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductSortMobileModule { }
