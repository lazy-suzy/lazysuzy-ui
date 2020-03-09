import { Component, OnInit, AfterContentChecked } from '@angular/core';
// import { MOCK_DEPARTMENTS } from './../../../mocks';
// import { IDepartment } from './../../../shared/models';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ApiService } from './../../../shared/services';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit{
  // departments: IDepartment[] = MOCK_DEPARTMENTS;
 
  newArrivals: any;
  newProducts: any;
  totalArrivals: any;
  topDeals: any;
  bestSellers: any;
  emailForm: FormGroup;
  constructor(private apiService: ApiService,  private formBuilder: FormBuilder) {}
  
  ngOnInit() {
    // this.getNewArrivals();
    // this.getTopDeals();
    // this.getBestSellers();

    this.emailForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, Validators.email]
      ]
    });
  }

  getNewArrivals(): void {
     this.apiService
      .getNewArrivals()
      .subscribe((res) => {
        this.newArrivals = res;
        this.newProducts = this.newArrivals.products;
      });
  }

  getTopDeals(): void{
    this.apiService.getTopDeals().subscribe((res) =>{
      this.topDeals = res.products;
    });
  }

  getBestSellers(): void{
    this.apiService.getBestSellers().subscribe((res)=>{
      this.bestSellers = res.products;
    })
  }

  onSubmit(value: any){
    this.apiService.getEmail().subscribe((res) =>{
    })
  }

}


  


