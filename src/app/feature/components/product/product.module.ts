import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductDetailsComponent } from './../product-details/product-details.component';
import { ProductComponent } from './product.component';
import { MatButtonModule } from '@angular/material/button';
import { VariationsModule } from '../variations/variations.module';

const DECLARATIONS = [ProductComponent, ProductDetailsComponent];

const MODULES = [
  CommonModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
  MatCheckboxModule,
  VariationsModule
];

const COMPONENTS = [ProductDetailsComponent];

@NgModule({
  declarations: [...DECLARATIONS],
  entryComponents: [...COMPONENTS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductModule {}
