import {
  NavDesktopModule,
  FooterModule,
  SearchBarModule,
  NavMobileModule,
  AboutusModule,
  PrivacyPolicyModule,
  TermsOfServiceModule,
  FooterMobileModule,
  BrandFooterModule,
  BannerModule
} from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './components/auth/auth.module';

const DECLARATIONS = [];

const MODULES = [
  CommonModule,
  NavDesktopModule,
  NavMobileModule,
  FooterModule,
  SearchBarModule,
  AboutusModule,
  PrivacyPolicyModule,
  TermsOfServiceModule,
  FooterMobileModule,
  BrandFooterModule,
  BannerModule,
  AuthModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class CoreModule {}
