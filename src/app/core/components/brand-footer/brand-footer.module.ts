import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandFooterComponent } from './brand-footer.component';

const DECLARATIONS = [BrandFooterComponent];

const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class BrandFooterModule { }
