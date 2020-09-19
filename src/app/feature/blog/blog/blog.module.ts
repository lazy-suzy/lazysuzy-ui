import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './components/blog/blog.component';
import { BlogContainerComponent } from './components/blog-container/blog-container.component';
import { PagePostsComponent } from './components/page-posts/page-posts.component';

@NgModule({
  declarations: [
    BlogComponent,
    PagePostsComponent,
    BlogContainerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    BlogRoutingModule,
    InfiniteScrollModule,
  ],
  exports: [BlogComponent]
})
export class BlogModule { }
