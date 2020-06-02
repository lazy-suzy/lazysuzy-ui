import { Component, OnInit, Input } from '@angular/core';
import {
  ApiService,
  UtilsService,
  EventEmitterService
} from './../../../shared/services';
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
  showLoader = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private utilsService: UtilsService,
    private eventEmitterService: EventEmitterService
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
    this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.getBestSellers();
      });
  }
  getBestSellers(): void {
    this.showLoader = true;
    this.apiService.getBestSellers().subscribe((res) => {
      this.bestSellers = res.products;
      this.showLoader = false;
    });
  }

  seeAll() {
    this.router.navigateByUrl('/products/all?bestseller=true');
  }

  openDialog(sku) {
    this.isHandset
      ? this.router.navigateByUrl(`/product/${sku}`)
      : this.utilsService.homepageMatDialog(sku);
  }

  handleEvtProductCarousal(e) {
    this.openDialog(e);
  }
}
