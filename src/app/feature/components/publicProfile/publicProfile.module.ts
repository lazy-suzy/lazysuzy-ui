import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicProfileComponent } from './publicProfile.component';
import { MatIconModule } from '@angular/material/icon';

const DECLARATIONS = [PublicProfileComponent];

const MODULES = [CommonModule, MatIconModule];
@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES]
})
export class PublicProfileModule {}
