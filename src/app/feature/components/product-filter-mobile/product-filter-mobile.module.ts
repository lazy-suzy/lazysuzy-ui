import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatButtonModule } from '@angular/material';
import { ProductFilterMobileComponent } from './product-filter-mobile.component';
import { Ng5SliderModule } from 'ng5-slider';
import { MatCheckboxModule } from '@angular/material/checkbox';

const DECLARATIONS = [ProductFilterMobileComponent];
const MODULES = [CommonModule, MatIconModule, MatButtonModule, Ng5SliderModule, MatCheckboxModule];


@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
  ...MODULES
  ],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductFilterMobileModule { }
