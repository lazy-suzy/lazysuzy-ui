import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthContainerComponent } from './auth-container.component';
import {AuthModule} from '../../../core/components/index';
const DECLARATIONS = [AuthContainerComponent];

const MODULES = [CommonModule, AuthModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class AuthContainerModule {}
