import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModule, ProductMobileModule } from './../../components';

import { SearchComponent } from './search.component';

const DECLARATIONS = [SearchComponent];

const MODULES = [CommonModule, ProductModule, ProductMobileModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class SearchModule {}
