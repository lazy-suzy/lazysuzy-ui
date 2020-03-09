import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { TermsOfServiceComponent } from './terms-of-service.component';

const DECLARATIONS = [TermsOfServiceComponent];

const MODULES = [CommonModule, RouterModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
exports: [...DECLARATIONS, ...MODULES]
})
export class TermsOfServiceModule { }
