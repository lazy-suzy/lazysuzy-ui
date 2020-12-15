import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NavDesktopComponent } from './nav-desktop.component';
import { SearchBarModule } from '../search-bar/search-bar.module';
import { AuthModule } from '../auth/auth.module';
import {BannerModule} from '../banner/banner.module';
const DECLARATIONS = [NavDesktopComponent];

const MODULES = [
  CommonModule,
  RouterModule,
  MatToolbarModule,
  MatMenuModule,
  MatButtonModule,
  MatIconModule,
  SearchBarModule,
  AuthModule,
  MatBadgeModule
];

@NgModule({
  declarations: [...DECLARATIONS],
    imports: [...MODULES, BannerModule],
  exports: [...DECLARATIONS, ...MODULES]
})
export class NavDesktopModule {}
