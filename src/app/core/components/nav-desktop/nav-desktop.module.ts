import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavDesktopComponent } from './nav-desktop.component';

const DECLARATIONS = [NavDesktopComponent];

const MODULES = [
  CommonModule,
  MatToolbarModule,
  MatMenuModule,
  MatButtonModule,
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class NavDesktopModule {}
