import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-arrivals',
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.less']
})
export class NewArrivalsComponent implements OnInit {
  newArrivals: any;
  newProducts: any;
  responsiveOptions: any;
  constructor(private apiService: ApiService, private router: Router) { 
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

  }

  ngOnInit() {
    this.getNewArrivals();
  }
  getNewArrivals(): void {
    this.apiService
     .getNewArrivals()
     .subscribe((res) => {
       this.newArrivals = res;
       this.newProducts = this.newArrivals.products;
     });
 }

 seeAll(){
   this.router.navigate(['/seeAllArrivals']);
 }


}
