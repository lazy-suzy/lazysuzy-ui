import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscribeComponent } from './subscribe.component';
import { FormsModule } from '@angular/forms';

const DECLARATIONS = [SubscribeComponent];

const MODULES = [CommonModule, RouterModule, FormsModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
exports: [...DECLARATIONS, ...MODULES],
})
export class SubscribeModule { }
