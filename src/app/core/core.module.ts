import { NavDesktopModule, FooterModule, SearchBarModule, NavMobileModule } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const DECLARATIONS = [];

const MODULES = [CommonModule, NavDesktopModule, NavMobileModule, FooterModule, SearchBarModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class CoreModule {}
