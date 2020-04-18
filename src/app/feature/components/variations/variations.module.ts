import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VariationsComponent } from './variations.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { SetsModule } from '../sets/sets.module';
const DECLARATIONS = [VariationsComponent];

const MODULES = [CommonModule, MatCheckboxModule, MatIconModule, MatExpansionModule, SetsModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VariationsModule {}
