import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicProfileComponent } from './publicProfile.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

const DECLARATIONS = [PublicProfileComponent];

const MODULES = [CommonModule, MatIconModule, RouterModule];
@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES]
})
export class PublicProfileModule {}
