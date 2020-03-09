import { NavDesktopModule} from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarModule } from './components/search-bar/search-bar.module';
import { BrandFooterModule } from './components/brand-footer/brand-footer.module';
import { BannerModule } from './components/banner/banner.module';
import { FooterModule} from './components/footer/footer.module';
import { NavMobileModule} from './components/nav-mobile/nav-mobile.module';

const DECLARATIONS = [];

const MODULES = [CommonModule, NavDesktopModule, FooterModule, SearchBarModule, BrandFooterModule, BannerModule, NavMobileModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class CoreModule {}
