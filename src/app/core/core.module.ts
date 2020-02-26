import { FooterModule } from './components/footer/footer.module';
import { NavDesktopModule } from './components/nav-desktop/nav-desktop.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarModule } from './components/search-bar/search-bar.module';

const DECLARATIONS = [];

const MODULES = [CommonModule, NavDesktopModule, FooterModule, SearchBarModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class CoreModule {}
