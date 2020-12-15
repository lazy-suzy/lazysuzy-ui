import {Component, Input, OnInit} from '@angular/core';
import { ApiService, EventEmitterService } from './../../../shared/services';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-browse-by-room',
  templateUrl: './browse-by-room.component.html',
  styleUrls: ['./browse-by-room.component.less']
})
export class BrowseByRoomComponent implements OnInit {
  @Input() isHandset=false;
  departments: any;
  ref = environment.BASE_HREF;
  eventSubscription: Subscription;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.onClick();
      });
  }
  onDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
  onClick() {
    this.apiService.browseRoom().subscribe((res: any) => {
      this.departments = res.all_departments;
      this.departments = this.departments.filter((val) => {
        if (val.department !== 'Bathroom' && val.department !== '') {
          return val;
        }
      });
    });
  }
}
