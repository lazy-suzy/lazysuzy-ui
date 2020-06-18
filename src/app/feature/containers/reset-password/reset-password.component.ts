import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {
  message: string;
  error: boolean = false;
  email: string = '';
  password: string = '';
  cpassword: string = '';
  isValidToken: boolean = false;
  token: string = '';
  isSuccess: boolean = false;
  routeSubscription: any;

  constructor(
    private apiService: ApiService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activeRoute.params.subscribe(
      (routeParams) => {
        this.token = routeParams.token;
        this.apiService.validateResetPasswordToken(this.token).subscribe(
          (data) => {
            this.isValidToken = true;
          },
          () => {
            this.isValidToken = false;
          }
        );
      }
    );
  }

  validateForm(email, password, cpassword) {
    this.error = false;
    if (!email) {
      this.error = true;
      this.message = 'Email cannot be blank';
    } else if (!password) {
      this.error = true;
      this.message = 'Password cannot be blank';
    } else if (password.length < 8) {
      this.error = true;
      this.message = 'Password must contain 8 characters';
    } else if (cpassword !== password) {
      this.error = true;
      this.message = 'Password do not match';
    }
    return !this.error;
  }

  sendPasswordReset() {
    this.isSuccess = false;
    if (this.validateForm(this.email, this.password, this.cpassword)) {
      this.apiService
        .setNewPassword({
          token: this.token,
          email: this.email,
          password: this.password,
          password_confirmation: this.cpassword
        })
        .subscribe(
          (data: any) => {
            this.message = 'Password reset successfully. Go to Login';
            this.isSuccess = data.status;
          },
          (error) => {
            this.error = true;
            this.message = error.error.message;
          }
        );
    }
  }
}
