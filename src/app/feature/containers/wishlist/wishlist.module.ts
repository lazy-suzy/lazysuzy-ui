import { ProductMobileModule } from './../../components/product-mobile/product-mobile.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModule } from './../../components';

import { WishlistComponent } from './wishlist.component';
import { MatIconModule } from '@angular/material/icon';

const DECLARATIONS = [WishlistComponent];

const MODULES = [CommonModule, ProductModule, ProductMobileModule, MatIconModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class WishlistModule {}
