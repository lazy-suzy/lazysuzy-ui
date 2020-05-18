import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';import { FormsModule } from '@angular/forms';
import { MatCardModule, MatSelectModule, MatInputModule } from '@angular/material';
import { ProductCustomiseComponent } from './product-customise/product-customise.component';
import { AdminDasboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    AdminDasboardRoutingModule,
    MatInputModule,
    MatSelectModule
  ],
  declarations: [
    AdminDashboardComponent,
    ProductCustomiseComponent
  ],
  entryComponents: [],
  providers: []
})
export class AdminDashboardModule { }
