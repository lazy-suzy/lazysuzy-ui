import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewProductListingComponent } from './new-product-listing/new-product-listing.component';


const routes: Routes = [
  {
    path:'',
    component:NewProductListingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewProductsDashboardRoutingModule { }
