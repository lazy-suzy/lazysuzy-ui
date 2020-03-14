import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthSuccessComponent } from './auth-success.component';

const DECLARATIONS = [AuthSuccessComponent];

const MODULES = [CommonModule, RouterModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
exports: [...DECLARATIONS, ...MODULES],
})
export class AuthSuccessModule { }
