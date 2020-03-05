import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.less']
})
export class BestSellersComponent implements OnInit {
  bestSellers: any;
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.getBestSellers();
  }
  getBestSellers(): void{
    this.apiService.getBestSellers().subscribe((res)=>{
      this.bestSellers = res.products;
      console.log("best sellers_________", this.bestSellers);
    })
  }

  seeAll(){
    console.log("showing all dadta");
    this.router.navigate(['/seeAllArrivals']);
  }
}
