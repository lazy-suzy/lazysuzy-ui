import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  openSearchPage(f) {
    console.log(f);
    window.location.href = `/search?query=${f.value.query}`;
  }
}
