import { Component, OnInit, Input } from '@angular/core';
import { ApiService, UtilsService } from './../../../shared/services';
import { Router } from '@angular/router';
import { Carousel } from 'primeng/carousel';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.less']
})
export class BestSellersComponent implements OnInit {
  bestSellers: any;
  responsiveOptions: any;
  @Input() isHandset: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private utilsService: UtilsService
  ) {
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
    Carousel.prototype.changePageOnTouch = (e, diff) => {};
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
    this.router.navigateByUrl('/products/all?bestseller=true');
  }

  openDialog(sku) {
    this.isHandset
      ? this.router.navigateByUrl(`/product/${sku}`)
      : this.utilsService.openMatDialog(sku);
  }
}
