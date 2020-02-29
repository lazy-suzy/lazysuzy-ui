import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less'],
})
export class SearchBarComponent {
  constructor(private router: Router) {}

  openSearch(form): void {
    this.router.navigateByUrl(`/search?query=${form.value.query}`);
  }
}