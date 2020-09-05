import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.less']
})
export class BrandListComponent implements OnInit {
  @Input() selectedBrandValue: string = '';
  @Input() isBrandPage: boolean = false;
  @Output() setBrand = new EventEmitter<any>();
  brandNameSubscription: Subscription;
  brandData: any[] = [];
  
  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllBrandNames();
  }

  onDestroy() {
    this.brandNameSubscription.unsubscribe();
  }

  getAllBrandNames() {
    this.brandNameSubscription = this.apiService.getAllBrandNames().subscribe((payload: any) => {
      this.brandData = payload;
      this.brandData.sort(function (a, b) { return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); });
    }, (error) => {
      console.log('this is error to get all brandData: ', error);
    });
  }

  onSetBrand(brandValue: string) {
    let filterValue = '';
    if (brandValue !== '') {
      filterValue = 'brand:' + brandValue + ';';
    };
    this.router.navigateByUrl(`/products/brand?undefined=true&limit=24&filters=${filterValue}&sort_type=&pageno=1`)
    this.setBrand.emit(brandValue);
  }

}
