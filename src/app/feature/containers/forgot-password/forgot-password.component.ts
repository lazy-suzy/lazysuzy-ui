import { Component, OnInit } from '@angular/core';
import { ApiService, UtilsService } from 'src/app/shared/services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {
  message: string;
  error = false;
  email = '';
  isSuccess = false;
  EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

  constructor(private apiService: ApiService, private utils: UtilsService) {}

  ngOnInit() {}

  validateForm(email) {
    this.error = false;
    if (!email) {
      this.error = true;
      this.message = 'Please enter your email address';
    } else if (!this.EMAIL_REGEX.test(email)) {
      this.error = true;
      this.message = 'Please enter a valid email address';
    }
    return !this.error;
  }

  sendPasswordReset() {
    this.isSuccess = false;
    if (this.validateForm(this.email)) {
      this.apiService.sendPasswordResetLink({ email: this.email }).subscribe(
        (data: any) => {
          this.message = 'Please check your email for further instructions.';
          this.isSuccess = data.status;
        },
        (error) => {
          this.error = true;
          this.message = error.error.message;
        }
      );
    }
  }

  openSignin() {
    this.utils.openSigninDialog();
  }
}
