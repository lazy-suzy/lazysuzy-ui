import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchProductModule } from './../../components';

import { SearchComponent } from './search.component';

const DECLARATIONS = [SearchComponent];

const MODULES = [CommonModule, SearchProductModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class SearchModule {}
