import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

const DECLARATIONS = [FooterComponent];

const MODULES = [
  CommonModule,
  RouterModule,
  AngularFontAwesomeModule,
  MatIconModule,
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class FooterModule {}
