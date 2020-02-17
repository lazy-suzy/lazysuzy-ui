import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SearchProductComponent } from './search-product.component';

const DECLARATIONS = [SearchProductComponent];

const MODULES = [CommonModule, MatIconModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES]
})
export class SearchProductModule {}
