import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-page-posts',
  templateUrl: './page-posts.component.html',
  styleUrls: ['./page-posts.component.scss']
})
export class PagePostsComponent implements OnInit {
  page$: Observable<any>;
  page: any;
  posts$: Observable<any[]>;
  posts: any[];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.page$ = this.route.data.pipe(map(r => r.content));
    this.posts$ = this.route.data.pipe(map(r => r.posts));

    this.page$.subscribe((page) => {
      this.page = page;
    });

    this.posts$.subscribe((posts) => {
      this.posts = posts;
    });
  }
}
