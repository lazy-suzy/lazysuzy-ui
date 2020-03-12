import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less'],
})
export class SearchBarComponent {
  @Input() notHome: boolean;
  textChange: boolean = false;

  constructor(private router: Router) {}

  openSearch(form): void {
    if (form.value.query.length > 0) {
    this.router.navigateByUrl(`/search?query=${form.value.query}`);
    } else {
    this.textChange = true;
    }
  }
}
