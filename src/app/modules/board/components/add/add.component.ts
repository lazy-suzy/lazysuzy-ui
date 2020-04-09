import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

// import * as dropzone from 'dropzone';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {

  customProducts = [];

  constructor(private apiService: ApiService) {
    // console.log(dropzone);
  }

  ngOnInit(): void {
    this.apiService.getCustomProducts().subscribe((s: any) => {
      this.customProducts = s;
    });
  }

}
