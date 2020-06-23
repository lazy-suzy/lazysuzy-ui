import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ApiService,
  UtilsService,
  CacheService,
  EventEmitterService
} from 'src/app/shared/services';
import { IDisplayProfile } from '../../../shared/models';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-public-profile',
  templateUrl: './publicProfile.component.html',
  styleUrls: ['./publicProfile.component.less']
})
export class PublicProfileComponent implements OnInit {
  routeSubscription: any;
  username: string;
  profile: IDisplayProfile;
  isLoading = false;
  spinner = 'assets/image/spinner.gif';
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.routeSubscription = this.activeRoute.params.subscribe(
      (routeParams) => {
        this.username = routeParams.profile;
      }
    );
    this.apiService
      .fetchDisplayProfile(this.username)
      .subscribe((payload: any) => {
        this.profile = payload;
        this.profile.picture = env.BASE_HREF + this.profile.picture;
        this.isLoading = false;
      });
  }
  onDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
