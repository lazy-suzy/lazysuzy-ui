import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailSubscriptionComponent } from './email-subscription.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [EmailSubscriptionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [EmailSubscriptionComponent, CommonModule, ReactiveFormsModule]
})
export class EmailSubscriptionModule { }
