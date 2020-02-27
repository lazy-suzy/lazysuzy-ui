import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  LandingComponent,
  ProductsComponent,
  SearchComponent,
  WishlistComponent
} from './feature/containers';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'wishlist', component: WishlistComponent, pathMatch: 'full' },
  {
    path: 'products/:department/:category',
    component: ProductsComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
