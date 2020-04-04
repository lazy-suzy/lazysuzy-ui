import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Subscription } from 'rxjs';
import { IProductPayload, IProductsPayload } from './../../../shared/models';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.less']
})
export class BannerComponent implements OnInit {
  bannerData: any;
  isBanner: boolean = true;
  @Input() isHandset: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.apiService.bannerData().subscribe(res => {
      this.bannerData = res;
    });
  }
}
