import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less']
})
export class SelectComponent implements OnInit {
  
  allDepartments = [];
  showLoader: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.apiService.getAllDepartments().subscribe((s: any) => {
      this.allDepartments = s;
      this.showLoader = false;
    });
  }

}
