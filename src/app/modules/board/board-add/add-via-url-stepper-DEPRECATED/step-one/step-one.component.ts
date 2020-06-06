// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { FormService } from '../../form.service';

// @Component({
//   selector: 'app-step-one',
//   templateUrl: './step-one.component.html',
//   styleUrls: ['./step-one.component.css']
// })
// export class StepOneComponent {
//   urlPattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
//   step: FormGroup;

//   constructor(
//     private _formBuilder: FormBuilder,
//     private formService: FormService
//   ) {
//     this.step = this._formBuilder.group({
//       imageUrl: ['', Validators.pattern(this.urlPattern)]
//     });
//     this.formService.stepReady(this.step, 'one');
//   }
//   get imageUrl() {
//     return this.step.get('imageUrl');
//   }
// }
