import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';

import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';

export function getAuthServiceConfigs() {
  const googleLoginOptions = {
    scope: 'email'
  };
  const fbLoginOptions = {
    scope: 'email',
    return_scopes: true,
    enable_profile_selector: true
  };
  let config = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        '937636462062-ineivis8h85l6ib4bc53r31moo7t4bdp.apps.googleusercontent.com',
        googleLoginOptions
      )
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('128412724729505', fbLoginOptions)
    }
  ]);
  return config;
}

const COMPONENTS = [SignupComponent, SigninComponent];
@NgModule({
  declarations: [AuthComponent, SigninComponent, SignupComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,
    SocialLoginModule
  ],
  exports: [AuthComponent, CommonModule],
  entryComponents: [...COMPONENTS],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ]
})
export class AuthModule {}
