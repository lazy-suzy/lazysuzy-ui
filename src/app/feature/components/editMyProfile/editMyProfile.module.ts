import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMyProfileComponent } from './editMyProfile.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

const DECLARATIONS = [EditMyProfileComponent];

const MODULES = [CommonModule, FormsModule, MatIconModule, RouterModule];
@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES]
})
export class EditMyProfileModule {}
