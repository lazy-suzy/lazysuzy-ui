import { Component, OnInit } from '@angular/core';
import { ApiService, EventEmitterService } from './../../../shared/services';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-browse-by-room',
  templateUrl: './browse-by-room.component.html',
  styleUrls: ['./browse-by-room.component.less']
})
export class BrowseByRoomComponent implements OnInit {
  departments: any;
  ref = environment.BASE_HREF;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.onClick();
      });
  }
  onClick() {
    this.apiService.browseRoom().subscribe((res: any) => {
      this.departments = res['all_departments'];
      this.departments = this.departments.filter(function (val) {
        if (val['department'] != 'Decor' && val['department'] != '') {
          return val;
        }
      });
    });
  }
}
