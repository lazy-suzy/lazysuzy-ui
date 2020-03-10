import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutusComponent } from './aboutus.component';
import { RouterModule } from '@angular/router';

const DECLARATIONS = [AboutusComponent];

const MODULES = [CommonModule, RouterModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class AboutusModule { }
