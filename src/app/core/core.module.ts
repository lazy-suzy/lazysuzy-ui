import { FooterModule } from './components/footer/footer.module';
import { NavDesktopModule } from './components/nav-desktop/nav-desktop.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchModule } from './components/search/search.module';

const DECLARATIONS = [];

const MODULES = [CommonModule, NavDesktopModule, FooterModule, SearchModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class CoreModule {}
