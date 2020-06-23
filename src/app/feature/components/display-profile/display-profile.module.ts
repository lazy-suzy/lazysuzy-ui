import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProfileComponent } from './display-profile.component';
import { MatIconModule } from '@angular/material/icon';

const DECLARATIONS = [DisplayProfileComponent];

const MODULES = [CommonModule, MatIconModule];
@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES]
})
export class DisplayProfileModule {}
