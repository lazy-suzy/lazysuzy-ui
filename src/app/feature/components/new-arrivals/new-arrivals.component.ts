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

  mySlideImages = [1, 2, 3].map((i) => `https://picsum.photos/640/480?image=${i}`);
  myCarouselImages = [1, 2, 3, 4, 5, 6].map((i) => `https://picsum.photos/640/480?image=${i}`);
  mySlideOptions = { items: 1, dots: true, nav: false };
  myCarouselOptions = { items: 3, dots: true, nav: true };
  showLoader = false;

  images = [
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_bags.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_book_cover.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_bags.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_book_cover.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_bags.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/43033/slider_book_cover.jpg"
  ];

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
    this.showLoader = true;
    this.apiService.getNewArrivals().subscribe(res => {
      this.newArrivals = res;
      this.newProducts = this.newArrivals.products;
      this.showLoader = false;
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

  handleEvtProductCarousal(e){
    this.openDialog(e);
  }
  
}
