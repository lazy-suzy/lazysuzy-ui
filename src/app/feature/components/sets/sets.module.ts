import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SetsComponent } from './sets.component';
const DECLARATIONS = [SetsComponent];

const MODULES = [CommonModule, MatIconModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SetsModule {}
