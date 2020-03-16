import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.less']
})
export class SubscribeComponent implements OnInit {
  @Input() category: string;
  @Input() homePage: boolean;
  email: string;
  invalidEmail: boolean = false;
  showSuccessMsg: boolean = false;
  subscriberExists: boolean = false;
  // tslint:disable-next-line:max-line-length
  EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
  constructor(private apiService: ApiService, private route: Router) { }

  ngOnInit() {
  }

  submit(data) {
    if (this.EMAIL_REGEX.test(data)) {
      this.invalidEmail = false;
      let url = window.location.href.split('?')[0] ;
      this.apiService
      .subscription(url, data)
      .subscribe((payload: any) => {
        if (payload.status === "We already have your email. Thanks!") {
          this.subscriberExists = true;
        } else
        if (payload.status === 'success') {
          this.showSuccessMsg = true;
        }
      });
    } else {
      this.invalidEmail = true;
    }
  }
}
