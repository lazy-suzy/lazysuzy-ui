import { Component, OnInit, Input } from '@angular/core';
import {
  ApiService,
  EventEmitterService,
  MatDialogUtilsService
} from './../../../shared/services';
import { Router } from '@angular/router';
import { Carousel } from 'primeng/carousel';
import { Subscription } from 'rxjs';
import {first} from 'rxjs/operators';
@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.less']
})
export class BestSellersComponent implements OnInit {
  bestSellers: any;
  responsiveOptions: any;
  @Input() isHandset = false;
  showLoader = false;
  eventSubscription: Subscription;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private matDialogUtils: MatDialogUtilsService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      }
    ];
  }

  ngOnInit() {
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.getBestSellers();
      });
  }
  onDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
  getBestSellers(): void {
    this.showLoader = true;
    this.apiService.getTrendingProducts().pipe(first()).subscribe((res) => {
      this.bestSellers = res;
      this.showLoader = false;
    });
  }

  seeAll() {
    this.router.navigateByUrl('/products/all?trending=true');
  }

  openDialog(sku) {
    this.isHandset
      ? this.router.navigateByUrl(`/product/${sku}`)
      : this.matDialogUtils.homepageMatDialog(sku);
  }

  handleEvtProductCarousal(e) {
    this.openDialog(e);
  }
}
