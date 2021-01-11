import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewFormComponent } from './reviewForm.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';

const DECLARATIONS = [ReviewFormComponent];

const MODULES = [CommonModule, FormsModule, MatIconModule, RouterModule,MatDialogModule];
@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES]
})
export class ReviewFormModule {}
