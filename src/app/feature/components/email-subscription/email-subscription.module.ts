import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailSubscriptionComponent } from './email-subscription.component';
import { ReactiveFormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';



@NgModule({
  declarations: [EmailSubscriptionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  exports: [EmailSubscriptionComponent,ToastModule, CommonModule, ReactiveFormsModule]
})
export class EmailSubscriptionModule { }
