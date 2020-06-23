import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProfileComponent } from './display-profile.component';

const DECLARATIONS = [DisplayProfileComponent];

const MODULES = [CommonModule];
@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES]
})
export class DisplayProfileModule {}
