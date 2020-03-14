import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-success',
  templateUrl: './auth-success.component.html',
  styleUrls: ['./auth-success.component.less']
})
export class AuthSuccessComponent implements OnInit {
  userDataSubscription: Subscription;
  constructor(private apiservice: ApiService) { }

  ngOnInit() {
    this.userDataSubscription = this.apiservice
      .getAuthData()
      .subscribe((payload:any) => {

      });
  }

  ngOnDestroy(): void {
    this.userDataSubscription.unsubscribe();
  }
}
