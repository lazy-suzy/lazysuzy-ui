import { FormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/shared/material-module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NewProductsDashboardRoutingModule } from "./new-products-dashboard-routing.module";
import { NewProductListingComponent } from "./new-product-listing/new-product-listing.component";
import { ProductFiltersModule } from "src/app/feature/components";
import { NewProductRowComponent } from "./new-product-row/new-product-row.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { AttributeFiltersComponent } from './attribute-filters/attribute-filters.component';

@NgModule({
  declarations: [NewProductListingComponent, NewProductRowComponent, AttributeFiltersComponent],
  imports: [
    CommonModule,
    NewProductsDashboardRoutingModule,
    MaterialModule,
    ProductFiltersModule,
    FormsModule,
    InfiniteScrollModule,
  ],
})
export class NewProductsDashboardModule {}
