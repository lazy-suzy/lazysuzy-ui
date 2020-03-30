import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { FormsModule } from '@angular/forms';

export function getAuthServiceConfigs() {
  const googleLoginOptions = {
    scope: 'email'
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
      provider: new FacebookLoginProvider('545201916109098')
    }
  ]);
  return config;
}

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    SocialLoginModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  exports: [AuthComponent, CommonModule, SocialLoginModule],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ]
})
export class AuthModule {}
