import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMobileComponent } from './nav-mobile.component';
import {
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatBadgeModule, MatTabsModule, MatListModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { SearchBarModule } from '../search-bar/search-bar.module';
import { AuthModule } from '../auth/auth.module';
import {BannerModule} from '../banner/banner.module';

const DECLARATIONS = [NavMobileComponent];

const MODULES = [
  CommonModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  RouterModule,
  SearchBarModule,
  AuthModule,
  MatBadgeModule
];

@NgModule({
  declarations: [...DECLARATIONS],
    imports: [...MODULES, MatTabsModule, MatListModule, BannerModule],
  exports: [...DECLARATIONS, ...MODULES]
})
export class NavMobileModule {}
