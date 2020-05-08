import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrderSuccessComponent } from './order-success.component';
import { RouterModule } from '@angular/router';
import { AmericanNumberPipe } from '../../../shared/pipes/american-number.pipe';

const DECLARATIONS = [OrderSuccessComponent,AmericanNumberPipe];

const MODULES = [CommonModule, RouterModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class OrderSuccessModule {}
