import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  LandingModule,
  ProductsModule,
  SearchModule,
  WishlistModule,
  CategoriesComponent,
} from './containers';
import { SeeAllArrivalsComponent } from './components/see-all-arrivals/see-all-arrivals.component';
import { SeeAllTopDealsComponent } from './components/see-all-top-deals/see-all-top-deals.component';
import { SeeAllBestSellersComponent } from './components/see-all-best-sellers/see-all-best-sellers.component';
import { AllProductsComponent } from './containers/all-products/all-products.component';
import { ProductDetailsMobileComponent } from './components/product-details-mobile/product-details-mobile.component';


const DECLARATIONS = [];

const MODULES = [
  CommonModule,
  ProductsModule,
  LandingModule,
  SearchModule,
  WishlistModule,
];

@NgModule({
  declarations: [...DECLARATIONS, CategoriesComponent, SeeAllArrivalsComponent, SeeAllTopDealsComponent, SeeAllBestSellersComponent, AllProductsComponent, ProductDetailsMobileComponent],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class FeatureModule {}
