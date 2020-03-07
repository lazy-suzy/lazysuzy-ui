import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-deals',
  templateUrl: './top-deals.component.html',
  styleUrls: ['./top-deals.component.less']
})
export class TopDealsComponent implements OnInit {
  topDeals: any;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.getTopDeals();
  }

  getTopDeals(): void{
    this.apiService.getTopDeals().subscribe((res) =>{
      this.topDeals = res.products;
      console.log("top deals_________", this.topDeals);
    });
  }

  seeAll(){
    console.log("showing all dadta");
    this.router.navigate(['/allProducts/top']);
  }
}
