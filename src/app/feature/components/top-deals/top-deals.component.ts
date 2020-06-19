import { Component, OnInit, Input } from '@angular/core';
import {
  ApiService,
  UtilsService,
  EventEmitterService
} from 'src/app/shared/services';
import { Router } from '@angular/router';
import { Carousel } from 'primeng/carousel';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-top-deals',
  templateUrl: './top-deals.component.html',
  styleUrls: ['./top-deals.component.less']
})
export class TopDealsComponent implements OnInit {
  topDeals: any;
  responsiveOptions: any;
  @Input() isHandset = false;
  showLoader = false;
  eventSubscription: Subscription;
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
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.getTopDeals();
      });
  }
  onDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
  getTopDeals(): void {
    this.showLoader = true;
    this.apiService.getTopDeals().subscribe((res) => {
      this.topDeals = res.products;
      this.showLoader = false;
    });
  }

  seeAll() {
    this.router.navigateByUrl('/products/all?sale=true');
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
