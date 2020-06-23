import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

const DECLARATIONS = [ProfileComponent];

const MODULES = [CommonModule, FormsModule, MatIconModule];
@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES]
})
export class ProfileModule {}
