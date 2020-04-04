import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../shared/services';
import {
  trigger,
  transition,
  useAnimation,
  style,
  animate
} from '@angular/animations';

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

  constructor(private apiService: ApiService) {}
  brands: any;

  ngOnInit() {
    this.getbrands();
  }
  getbrands() {
    this.apiService.getBrands().subscribe(res => {
      this.brands = res;
      this.brands = this.brands.filter(function(val) {
        if (val['value'] != 'potterybarn') {
          return val;
        }
      });
    });
  }
}
