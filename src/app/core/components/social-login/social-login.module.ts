import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { SocialLoginComponent } from './social-login.component';

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

const DECLARATIONS = [SocialLoginComponent];

const MODULES = [CommonModule, SocialLoginModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ]
})
export class SocialLoginButtonModule {}
