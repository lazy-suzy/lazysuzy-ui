import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RedirectComponent } from './redirect.component';
import { RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material';

const DECLARATIONS = [RedirectComponent];

const MODULES = [CommonModule, RouterModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES, FormsModule, MatIconModule],
  exports: [...DECLARATIONS, ...MODULES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RedirectModule {}
