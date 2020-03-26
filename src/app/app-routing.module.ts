import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  LandingComponent,
  ProductsComponent,
  SearchComponent,
  WishlistComponent,
  CategoriesComponent,
  AllProductsComponent
} from './feature/containers';
import {
  AboutusComponent,
  TermsOfServiceComponent,
  PrivacyPolicyComponent
} from './core/components';
import {
  ProductDetailsMobileComponent,
  AuthSuccessComponent
} from './feature/components';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'termsofservice', component: TermsOfServiceComponent },
  { path: 'privacypolicy', component: PrivacyPolicyComponent },

  { path: 'wishlist', component: WishlistComponent, pathMatch: 'full' },
  {
    path: 'products/all',
    component: AllProductsComponent,
    pathMatch: 'full'
  },
  {
    path: 'products/:department',
    component: CategoriesComponent,
    pathMatch: 'full'
  },
  {
    path: 'products/:department/:category',
    component: ProductsComponent,
    pathMatch: 'full'
  },
  {
    path: 'product/:product',
    component: ProductDetailsMobileComponent,
    pathMatch: 'full'
  },
  {
    path: 'authSuccess',
    component: AuthSuccessComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
