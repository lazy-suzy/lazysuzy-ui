import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../shared/services';
import { Router } from '@angular/router';
import { environment} from './../../../../environments/environment';

@Component({
  selector: 'app-browse-by-room',
  templateUrl: './browse-by-room.component.html',
  styleUrls: ['./browse-by-room.component.less']
})
export class BrowseByRoomComponent implements OnInit {
  departments: any;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.onClick();
  }
  onClick(){
    console.log("in_________")
    this.apiService.browseRoom().subscribe((res: any) => {
      console.log("response", res)
      this.departments = res['all_departments'];
      this.departments = this.departments.filter(function(val){
        if(val['department'] != 'Decor'){
          val.link = environment.API_BASE_HREF+val.link;
          return val;
        }
      })
      console.log("departmnet___________", this.departments);
    })
    
  }

}
