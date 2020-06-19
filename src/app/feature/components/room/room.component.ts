import { Component, OnInit, Input } from '@angular/core';
import { IDepartment } from 'src/app/shared/models';
import { OwlCarousel } from 'ngx-owl-carousel';
declare var $: any;

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit {
  @Input() department: IDepartment;
  placeholder = 'assets/image/placeholder.png';

  category = {};
  // category1 = [];
  // display

  constructor() {}

  ngOnInit() {
    this.category = this.department;
    //   this.category1.push(this.category)
    //   console.log("categories_________", this.category1)
    // //   Object.values(this.category).map(function(values, index){
    // // console.log("value", values[1])

    // //   })
    //   // this.display = this.category.display
  }
}
