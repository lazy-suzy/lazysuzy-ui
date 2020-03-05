import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material';
import { SortTypeComponent } from './sort-type.component';

const DECLARATIONS = [SortTypeComponent];

const MODULES = [CommonModule, MatSelectModule, MatIconModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})

export class SortTypeModule {}
