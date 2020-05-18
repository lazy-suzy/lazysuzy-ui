import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

interface Todo {
  content: string;
  id?: string;
  datemodified?: Date;
  isDone?: boolean;
}

@Component({
  selector: 'app-product-customise',
  templateUrl: './product-customise.component.html',
  styleUrls: ['./product-customise.component.scss']
})
export class ProductCustomiseComponent implements OnInit {

  states = [
    { value: 'state-1', viewValue: 'State One' },
    { value: 'state-2', viewValue: 'State Two' },
    { value: 'state-3', viewValue: 'State Three' }
  ];

  constructor() { }

  ngOnInit() { }

  someMethod(item,value) {
    console.log(value, item);
  }

}
