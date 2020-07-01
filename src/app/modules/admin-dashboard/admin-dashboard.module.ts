import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatSelectModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatRadioModule
} from '@angular/material';
import { ProductCustomiseComponent } from './product-customise/product-customise.component';
import { AdminDasboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProductListingComponent } from './admin-product-listing/admin-product-listing.component';
import {
  ProductFiltersModule,
  SortTypeModule
} from './../../../app/feature/components';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    AdminDasboardRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    ProductFiltersModule,
    SortTypeModule,
    InfiniteScrollModule,
    MatRadioModule
  ],
  declarations: [
    AdminDashboardComponent,
    ProductCustomiseComponent,
    AdminProductListingComponent
  ],
  entryComponents: [],
  providers: []
})
export class AdminDashboardModule {}
