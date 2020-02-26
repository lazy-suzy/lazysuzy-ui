import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModule } from './../../components';

import { WishlistComponent } from './wishlist.component';

const DECLARATIONS = [WishlistComponent];

const MODULES = [CommonModule, ProductModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class WishlistModule {}
