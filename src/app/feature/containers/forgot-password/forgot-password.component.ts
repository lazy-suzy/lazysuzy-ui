import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {
  message: string;
  error: boolean = false;
  email: string = '';
  isSuccess: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  validateForm(email) {
    this.error = false;
    if (!email) {
      this.error = true;
      this.message = 'Email cannot be blank';
    }
    return !this.error;
  }

  sendPasswordReset() {
    this.isSuccess = false;
    if (this.validateForm(this.email)) {
      this.apiService.sendPasswordResetLink({ email: this.email }).subscribe(
        (data: any) => {
          this.message = data.message;
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
