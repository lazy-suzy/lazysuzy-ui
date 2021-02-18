import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionsDashboardRoutingModule } from './collections-dashboard-routing.module';
import { CollectionsDashboardComponent } from './collections-dashboard/collections-dashboard.component';
import {MatButtonModule, MatRadioModule, MatSelectModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [CollectionsDashboardComponent],
    imports: [
        CommonModule,
        CollectionsDashboardRoutingModule,
        MatSelectModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatRadioModule
    ]
})
export class CollectionsDashboardModule { }
