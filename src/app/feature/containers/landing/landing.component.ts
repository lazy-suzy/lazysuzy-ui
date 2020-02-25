import { Component, OnInit } from '@angular/core';
import { MOCK_DEPARTMENTS } from './../../../mocks';
import { IDepartment } from './../../../shared/models';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {
  departments: IDepartment[] = MOCK_DEPARTMENTS;
  constructor() {}

  ngOnInit() {}
}
