import { Component, OnInit, Input } from '@angular/core';
import { ApiService, UtilsService } from './../../../shared/services';
import { Router } from '@angular/router';
import { Carousel } from 'primeng/carousel';

@Component({
  selector: 'app-new-arrivals',
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.less']
})
export class NewArrivalsComponent implements OnInit {
  newArrivals: any;
  newProducts: any;
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
        numVisible: 2,
        numScroll: 2
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
    this.getNewArrivals();
  }
  getNewArrivals(): void {
    this.apiService.getNewArrivals().subscribe(res => {
      this.newArrivals = res;
      this.newProducts = this.newArrivals.products;
    });
  }

  seeAll() {
    this.router.navigateByUrl('/products/all?new=true');
  }

  openDialog(sku) {
    this.isHandset
      ? this.router.navigateByUrl(`/product/${sku}`)
      : this.utilsService.homepageMatDialog(sku);
  }
}
