import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-email-subscription',
  templateUrl: './email-subscription.component.html',
  styleUrls: ['./email-subscription.component.less']
})
export class EmailSubscriptionComponent implements OnInit {
  emailForm: FormGroup;
  constructor(private apiService: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, Validators.email]
      ]
    });
  }
  onSubmit(value: any){
    console.log("email submitted________", value);
    this.apiService.getEmail().subscribe((res) =>{
      console.log("response", res);
    })
  }

}
