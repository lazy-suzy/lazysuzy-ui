import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrderSuccessComponent } from './order-success.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

const DECLARATIONS = [OrderSuccessComponent];

const MODULES = [CommonModule, RouterModule, FormsModule, SharedModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class OrderSuccessModule {}
