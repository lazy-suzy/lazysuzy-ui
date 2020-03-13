import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';
import {CookieService} from 'ngx-cookie-service';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {
  @ViewChild('closeLoginModal') closeLoginModal: ElementRef;

  userCookie: string;
  user: any;
  constructor(  private socialAuthService: AuthService, private apiService: ApiService, private cookie: CookieService) { }

  ngOnInit(){
    this.fetchUser();
  }

  fetchUser() {
    this.userCookie = this.cookie.get('token');
    if (this.userCookie) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  public socialSignIn(socialPlatform : string) {
    let socialPlatformProvider;
    if(socialPlatform == "facebook"){
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }else if(socialPlatform == "google"){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else{ return; }
    
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
      }
    );
  }

  login(email, password) {
    const formData: any = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    this.apiService
      .login(formData)
      .subscribe((payload: any) => {
        this.cookie.set('token', payload.success.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
        this.closeLoginModal.nativeElement.click();
        this.fetchUser();
      });
  }

  signup(name,email, password) {
    var formData: any = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    this.apiService
      .signup(formData)
      .subscribe((payload: any) => {
        console.log(payload);
      });
  }

  logout() {
    this.cookie.delete('token');
    localStorage.removeItem('user');
    this.fetchUser();
  }
}
