import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ApiService } from 'src/app/shared/services';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-email-subscription',
  templateUrl: './email-subscription.component.html',
  styleUrls: ['./email-subscription.component.less']
})
export class EmailSubscriptionComponent implements OnInit {
  emailForm: FormGroup;
  emailSubmitted = false;
  response: any;
  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private messageService: MessageService) { }

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
    if(value.length > 0){
    this.apiService.getEmail().subscribe((res) =>{
      console.log("response", res);
      this.emailSubmitted = true;
    })
  }
  else{
    this.messageService.add({
      severity: "error",
      summary: "Error message",
      detail: "Please enter valid email!"
    });
  }
}

}
