import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductMobileComponent } from './product-mobile.component';

import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';


const DECLARATIONS = [ProductMobileComponent];
const MODULES = [CommonModule, MatIconModule, MatButtonModule,RouterModule];


@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
    ...MODULES
  ],
  exports: [...DECLARATIONS, ...MODULES]
})
export class ProductMobileModule { }
