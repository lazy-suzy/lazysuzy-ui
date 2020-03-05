import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-see-all-best-sellers',
  templateUrl: './see-all-best-sellers.component.html',
  styleUrls: ['./see-all-best-sellers.component.less']
})
export class SeeAllBestSellersComponent implements OnInit {
total: any;
bestSellers: any;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService
    .getBestSellers()
    .subscribe((res) => {
      console.log("response", res)
     this.total = res.total
     console.log("total from old", this.total);
     this.seeAll();

    });
 }
 seeAll(){

   this.apiService.seeAllDeals(this.total).subscribe((res)=>{
     this.bestSellers = res['products'];
     console.log("sellers",this.bestSellers);
   })
 }
  }

