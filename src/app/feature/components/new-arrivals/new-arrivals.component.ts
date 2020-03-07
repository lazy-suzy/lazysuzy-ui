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
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.getNewArrivals();
  }
  getNewArrivals(): void {
    this.apiService
     .getNewArrivals()
     .subscribe((res) => {
       this.newArrivals = res;
       this.newProducts = this.newArrivals.products;
       
       console.log("new products>>>>>>>>>>>>>>", this.newProducts)
     });
 }

 seeAll(){
   console.log("showing all dadta");
   this.router.navigate(['/allProducts/new']);
 }


}
