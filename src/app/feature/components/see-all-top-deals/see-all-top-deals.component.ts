import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-see-all-top-deals',
  templateUrl: './see-all-top-deals.component.html',
  styleUrls: ['./see-all-top-deals.component.less']
})
export class SeeAllTopDealsComponent implements OnInit {
total: any;
topDeals: any;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService
     .getTopDeals()
     .subscribe((res) => {
       console.log("response", res)
      this.total = res.total
      console.log("total from old", this.total);
      this.seeAll();

     });
  }
  seeAll(){

    this.apiService.seeAllDeals(this.total).subscribe((res)=>{
      this.topDeals = res['products'];
      console.log("deals",this.topDeals);
    })
  }

  }


