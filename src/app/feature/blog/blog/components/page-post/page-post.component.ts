import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-page-post',
  templateUrl: './page-post.component.html',
  styleUrls: ['./page-post.component.scss']
})
export class PagePostComponent implements OnInit {
  post$: Observable<any>;
  post: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.post$ = this.route.data.pipe(map(r => r.content));
    this.post$.subscribe((post) => {
      this.post = post;
    });
  }
}
