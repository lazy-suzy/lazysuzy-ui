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
import { SeeAllArrivalsComponent } from './feature/components/see-all-arrivals/see-all-arrivals.component';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
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
    path: 'seeAllArrivals',
    component: SeeAllArrivalsComponent,
    pathMatch: 'full'
  },
  {
    path: 'seeAllTopdeals',
    component: SeeAllArrivalsComponent,
    pathMatch: 'full'
  },
  {
    path: 'seeAllBestsellers',
    component: SeeAllArrivalsComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
