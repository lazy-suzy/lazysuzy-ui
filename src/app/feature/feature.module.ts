import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductsModule } from './containers';

const DECLARATIONS = [];

const MODULES = [CommonModule, ProductsModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class FeatureModule {}
