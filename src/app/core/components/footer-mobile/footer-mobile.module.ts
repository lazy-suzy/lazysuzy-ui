import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { RouterModule } from '@angular/router';
import { FooterMobileComponent } from './footer-mobile.component';

const DECLARATIONS = [FooterMobileComponent];

const MODULES = [CommonModule, RouterModule, AngularFontAwesomeModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
exports: [...DECLARATIONS, ...MODULES]
})
export class FooterMobileModule { }
