import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less']
})
export class SearchBarComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  openSearchPage(f) {
    console.log(f);
    window.location.href = `/search?query=${f.value.query}`;
  }
}
