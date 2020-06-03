import { Component, OnInit } from '@angular/core';
import { ApiService, EventEmitterService } from './../../../shared/services';
import {
  trigger,
  transition,
  useAnimation,
  style,
  animate
} from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-brand-footer',
  templateUrl: './brand-footer.component.html',
  styleUrls: ['./brand-footer.component.less'],

  animations: [
    trigger('fadeInUp', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(2000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BrandFooterComponent implements OnInit {
  fade: any;
  eventSubscription: Subscription;
  constructor(
    private apiService: ApiService,
    private eventEmitterService: EventEmitterService
  ) {}
  brands: any;

  ngOnInit() {
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.getbrands();
      });
  }
  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
  getbrands() {
    this.apiService.getBrands().subscribe((res) => {
      this.brands = res;
      this.brands = this.brands.filter(function (val) {
        if (val['value'] != 'potterybarn') {
          return val;
        }
      });
    });
  }
}
