import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-see-all-arrivals',
  templateUrl: './see-all-arrivals.component.html',
  styleUrls: ['./see-all-arrivals.component.less']
})
export class SeeAllArrivalsComponent implements OnInit {
  newArrivals: any;
  total: any;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
  this.apiService
     .getNewArrivals()
     .subscribe((res) => {
      this.total = res.total
      this.seeAll();

     });
  }
  seeAll(){

    this.apiService.seeAllArrivals(this.total).subscribe((res)=>{
      this.newArrivals = res['products'];
    })
  }

}
