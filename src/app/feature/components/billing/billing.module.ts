import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BillingComponent } from './billing.component';
const DECLARATIONS = [BillingComponent];

const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
exports: [...DECLARATIONS, ...MODULES],
})
export class BillingModule {}
