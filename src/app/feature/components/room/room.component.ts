import { Component, OnInit, Input } from '@angular/core';
import { IDepartment } from 'src/app/shared/models';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.less']
})
export class RoomComponent implements OnInit {
  @Input() department: IDepartment;
  placeholder: string = 'assets/images/placeholder.png';

  constructor() {}

  ngOnInit() {}
}
