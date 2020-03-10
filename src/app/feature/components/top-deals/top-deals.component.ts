import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-deals',
  templateUrl: './top-deals.component.html',
  styleUrls: ['./top-deals.component.less']
})
export class TopDealsComponent implements OnInit {
  topDeals: any;
  responsiveOptions: any;
  constructor(private apiService: ApiService, private router: Router) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit() {
    this.getTopDeals();
  }

  getTopDeals(): void {
    this.apiService.getTopDeals().subscribe(res => {
      this.topDeals = res.products;
    });
  }

  seeAll(){
    // this.router.navigate(['/allProducts/top']);
    this.router.navigate(['/seeAllTopdeals']);

  }
}
