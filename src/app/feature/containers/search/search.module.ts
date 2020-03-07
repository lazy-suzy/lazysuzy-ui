import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchProductModule } from './../../components';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SearchComponent } from './search.component';

const DECLARATIONS = [SearchComponent];

const MODULES = [CommonModule, SearchProductModule, InfiniteScrollModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES]
})
export class SearchModule {}
