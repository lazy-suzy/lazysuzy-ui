import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NavDesktopComponent } from './nav-desktop.component';
import { SearchBarModule } from '../search-bar/search-bar.module';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular-6-social-login";

const DECLARATIONS = [NavDesktopComponent, ];

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider("840582405192-fkr4bq3fp5q5doe386kkfikeie1ggn0p.apps.googleusercontent.com")
        },
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("545201916109098")
        },
      ]
  );
  return config;
}
 

const MODULES = [
  CommonModule,
  RouterModule,
  MatToolbarModule,
  MatMenuModule,
  MatButtonModule,
  MatIconModule,
  SearchBarModule,
  SocialLoginModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
  providers: [
  {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }
  ],
})
export class NavDesktopModule {}
