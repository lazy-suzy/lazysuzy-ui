import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password.component';

const DECALARATIONS = [ForgotPasswordComponent];

const MODULES = [CommonModule, FormsModule];
@NgModule({
  declarations: [...DECALARATIONS],
  imports: [...MODULES],
  exports: [...MODULES]
})
export class ForgotPasswordModule {}
