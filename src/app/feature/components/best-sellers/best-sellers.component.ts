import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.less']
})
export class BestSellersComponent implements OnInit {
  bestSellers: any;
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
    this.getBestSellers();
  }
  getBestSellers(): void {
    this.apiService.getBestSellers().subscribe(res => {
      this.bestSellers = res.products;
    });
  }

  seeAll() {
    this.router.navigate(['/allProducts/best']);
  }
}
