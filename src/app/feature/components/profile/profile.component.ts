import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { IProfile } from '../../../shared/models';
import { environment as env } from 'src/environments/environment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
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
  isProfileUpdated = false;
  hasWebsiteError = false;
  hasUsernameError = false;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getProfile().subscribe((payload: any) => {
      const userData = payload.auth.user;
      this.profileData.username = userData.username;
      this.profileData.firstName = userData.first_name;
      this.profileData.lastName = userData.last_name;
      this.profileData.website = userData.website;
      this.profileData.location = userData.location;
      this.profileData.description = userData.description;
      this.profileData.tag_line = userData.tag_line;
      this.imageSrc = env.BASE_HREF + userData.picture;
      this.presentUserName = userData.username;
    });
  }

  profileUpdate() {
    this.isLoading = true;
    const formData = new FormData();
    if (this.file) {
      formData.append('image', this.file);
    }
    formData.append('location', this.profileData.location);
    formData.append('website', this.profileData.website);
    formData.append('description', this.profileData.description);
    formData.append('tag_line', this.profileData.tag_line);
    if (this.presentUserName !== this.profileData.username) {
      formData.append('username', this.profileData.username);
    }
    this.apiService.updateProfile(formData).subscribe((payload: any) => {
      this.isLoading = false;
      this.isProfileUpdated = true;
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
        self.isProfileUpdated = false;
        self.hasWebsiteError = false;
        self.hasUsernameError = false;
      }, 5000);
    });
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
      };
    }
  }
}
