import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { ProductDetailsMobileComponent } from './product-details-mobile.component';
import { VariationsModule } from '../variations/variations.module';

const DECLARATIONS = [ProductDetailsMobileComponent];

const MODULES = [CommonModule, MarkdownModule, VariationsModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductDetailsMobileModule {}
