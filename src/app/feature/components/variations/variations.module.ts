import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VariationsComponent } from './variations.component';

const DECLARATIONS = [VariationsComponent];

const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VariationsModule {}
