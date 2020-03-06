import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less'],
})
export class SearchBarComponent {
  textChange = false;
  constructor(private router: Router) {}

  openSearch(form): void {
    console.log("submitted term length", form.value.query.length);
    console.log("text  change", this.textChange)

    if(form.value.query.length > 0)
    this.router.navigateByUrl(`/search?query=${form.value.query}`);
    else
    this.textChange = true;
    console.log("text  changed", this.textChange)
    
  }
}
