import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';

const DECLARATIONS = [ProfileComponent];

const MODULES = [CommonModule];
@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES]
})
export class ProfileModule {}
