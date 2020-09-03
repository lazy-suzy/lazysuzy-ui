import { Component, OnInit } from '@angular/core';
import {
  ApiService,
  EventEmitterService,
  UtilsService
} from 'src/app/shared/services';
import { IProfile } from '../../../shared/models';
import { environment as env } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './editMyProfile.component.html',
  styleUrls: ['./editMyProfile.component.less']
})
export class EditMyProfileComponent implements OnInit {
  profileData: IProfile = {
    username: '',
    firstName: '',
    lastName: '',
    description: '',
    website: '',
    location: '',
    image: '',
    tag_line: ''
  };
  file: any;
  imageSrc: any;
  hasEditIcon = false;
  isLoading = false;
  presentUserName: string;
  spinner = 'assets/image/spinner.gif';
  hasWebsiteError = false;
  hasUsernameError = false;
  hasImage: boolean;
  eventSubscription: Subscription;
  websiteRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9].[a-zA-Z]{2,}$/;
  hasEditedInput = ['description', 'location', 'website', 'tag_line'];
  constructor(
    private apiService: ApiService,
    private eventEmitterService: EventEmitterService,
    private router: Router,
    private cookie: CookieService,
    private snackBar: MatSnackBar,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        if (user.user_type === 0) {
          this.router.navigate([`/`]);
        }
        this.apiService.getProfile().subscribe((payload: any) => {
          const userData = payload.auth.user;
          this.profileData.username = userData.username;
          this.profileData.firstName = userData.first_name;
          this.profileData.lastName = userData.last_name;
          for (const key of this.hasEditedInput) {
            this.profileData[key] = this.hasNull(userData[key]);
          }
          this.hasImage =
            userData.picture && userData.picture !== 'null' ? true : false;
          if (this.hasImage) {
            this.imageSrc = this.utils.updateProfileImageLink(userData.picture);
          }
          this.presentUserName = userData.username;
        });
      });
  }

  onDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

  profileUpdate() {
    this.isLoading = true;
    const formData = new FormData();
    if (this.file) {
      formData.append('image', this.file);
    }
    if (this.profileData.website) {
      if (this.profileData.website.match(this.websiteRegex)) {
        this.profileData.website = 'http://' + this.profileData.website;
      }
    }
    for (const key of this.hasEditedInput) {
      formData.append(key, this.hasNull(this.profileData[key]));
    }
    if (this.presentUserName !== this.profileData.username) {
      formData.append('username', this.profileData.username);
    }
    this.apiService.updateProfile(formData).subscribe((payload: any) => {
      this.isLoading = false;
      this.snackBar.open('Profile Updated', 'Dismiss', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      const token = this.cookie.get('token');
      this.eventEmitterService.fetchUser(token, payload.user);
      if (payload.errors.length) {
        const errorsArray = payload.errors;
        for (const error of errorsArray) {
          if (error.original.error.website) {
            this.hasWebsiteError = true;
          }
          if (error.original.error.username) {
            this.hasUsernameError = true;
          }
        }
      }
      const self = this;
      setTimeout(() => {
        self.hasWebsiteError = false;
        self.hasUsernameError = false;
      }, 5000);
    });
  }
  hasNull(data) {
    if (data && data !== 'null') {
      return data;
    }
    return '';
  }
  over() {
    this.hasEditIcon = true;
  }

  out() {
    this.hasEditIcon = false;
  }

  readFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      this.file = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.hasImage = true;
      };
    }
  }
}
