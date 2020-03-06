import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMobileComponent } from './nav-mobile.component';
import {
  MatSidenavModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { SearchBarModule } from '../search-bar/search-bar.module';

const DECLARATIONS = [NavMobileComponent];

const MODULES = [
  CommonModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  RouterModule,
  SearchBarModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
exports: [...DECLARATIONS, ...MODULES],
})
export class NavMobileModule {}
