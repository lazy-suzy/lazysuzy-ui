import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  page$: Observable<any>;
  page: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.page$ = this.route.data.pipe(map(r => r.content));
    this.page$.subscribe((page) => {
      this.page = page;
    });
  }
}
