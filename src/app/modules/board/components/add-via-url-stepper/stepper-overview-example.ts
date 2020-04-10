import {Component} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {FormService} from './form.service';
 
@Component({
  selector: 'stepper-overview-example',
  templateUrl: 'stepper-overview-example.html',
  styleUrls: ['stepper-overview-example.css'],
  providers: [ FormService ]
})
export class StepperOverviewExample {
  
  isLinear = false;
  myForm: Array<string>

  constructor(
    public formService: FormService,
    private fb: FormBuilder
  ) {
    this.myForm = this.formService.mainForm.value
  }

  keys() : Array<string> {
    return Object.keys(this.myForm);
  }
}
