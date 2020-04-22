import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { MatIconModule } from '@angular/material/icon';
import { ProductDetailsMobileComponent } from './product-details-mobile.component';
import { VariationsModule } from '../variations/variations.module';
import { RedirectModule } from '../redirect/redirect.module';

const DECLARATIONS = [ProductDetailsMobileComponent];

const MODULES = [
  CommonModule,
  MarkdownModule,
  MatIconModule,
  VariationsModule,
  RedirectModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductDetailsMobileModule {}
