import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, EventEmitterService } from 'src/app/shared/services';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {
  message: string;
  error = false;
  email = '';
  password = '';
  cpassword = '';
  isValidToken = false;
  token = '';
  isSuccess = false;
  routeSubscription: any;
  constructor(
    private apiService: ApiService,
    private activeRoute: ActivatedRoute,
    private eventService: EventEmitterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeSubscription = this.activeRoute.queryParams.subscribe(
      (routeParams) => {
        this.token = routeParams.token;
        this.email = routeParams.email;
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
      this.message = 'Passwords do not match';
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
            this.message = 'Password reset successfully. Signing in..';
            this.isSuccess = true;
            const formData: any = new FormData();
            formData.append('email', this.email);
            formData.append('password', this.password);
            this.apiService.login(formData).subscribe((payload: any) => {
              if (payload.success) {
                this.error = false;
                this.eventService.fetchUser(
                  payload.success.token,
                  payload.user
                );
                this.router.navigateByUrl('/');
              }
            });
          },
          (error) => {
            this.error = true;
            this.message = error.error.message;
          }
        );
    }
  }

}
