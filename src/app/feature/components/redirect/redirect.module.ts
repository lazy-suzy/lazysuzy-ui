import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RedirectComponent } from './redirect.component';
import { RouterModule } from '@angular/router';

const DECLARATIONS = [RedirectComponent];

const MODULES = [CommonModule, RouterModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RedirectModule {}
