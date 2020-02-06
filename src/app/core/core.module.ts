import { NavDesktopModule } from './components/nav-desktop/nav-desktop.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const DECLARATIONS = [];

const MODULES = [CommonModule, NavDesktopModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class CoreModule {}
