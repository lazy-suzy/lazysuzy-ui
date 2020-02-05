import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavDesktopComponent } from './nav-desktop.component';

const DECLARATIONS = [NavDesktopComponent];

const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class NavDesktopModule {}
