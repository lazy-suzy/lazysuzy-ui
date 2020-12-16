import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsCarousalComponent } from './components/products-carousal/products-carousal.component';
import { OwlModule } from 'ngx-owl-carousel';
import { LoaderModule } from './components/loader/loader.module';
import { MaterialModule } from './material-module';
import { AmericanNumberPipe } from './pipes/american-number.pipe';
import { RouterModule } from '@angular/router';
import { WishlistSnackbarComponent } from './components/wishlist-snackbar/wishlist-snackbar.component';

const DECLARATIONS = [ProductsCarousalComponent, AmericanNumberPipe];

const MODULES = [
  CommonModule,
  OwlModule,
  LoaderModule,
  MaterialModule,
  RouterModule
];

@NgModule({
  declarations: [...DECLARATIONS, WishlistSnackbarComponent],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
  entryComponents: [
    WishlistSnackbarComponent,
  ],
})
export class SharedModule {}
