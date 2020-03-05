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
  console.log("see all____________________");
  this.apiService
     .getNewArrivals()
     .subscribe((res) => {
       console.log("response", res)
      this.total = res.total
      console.log("total from old", this.total);
      this.seeAll();

     });
  }
  seeAll(){

    this.apiService.seeAllArrivals(this.total).subscribe((res)=>{
      this.newArrivals = res['products'];
      console.log("arivals",this.newArrivals);
    })
  }

}
