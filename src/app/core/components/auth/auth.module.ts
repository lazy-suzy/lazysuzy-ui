import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SocialLoginButtonModule } from '../social-login/social-login.module';
import { FormsModule } from '@angular/forms';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';

const COMPONENTS = [SignupComponent, SigninComponent];
@NgModule({
  declarations: [AuthComponent, SigninComponent, SignupComponent],
  imports: [
    CommonModule,
    SocialLoginButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  exports: [AuthComponent, CommonModule, SocialLoginButtonModule],
  entryComponents: [...COMPONENTS]
})
export class AuthModule {}
