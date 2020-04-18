import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.component.html',
  styleUrls: ['./sets.component.less']
})
export class SetsComponent implements OnInit {
  @Input() sets = [];
  @Input() brand: string;

  constructor() { }

  ngOnInit() {
  }

}
