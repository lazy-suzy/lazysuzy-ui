import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProductComponent } from './product.component';

const DECLARATIONS = [ProductComponent];

const MODULES = [CommonModule, MatCardModule, MatIconModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class ProductModule {}
