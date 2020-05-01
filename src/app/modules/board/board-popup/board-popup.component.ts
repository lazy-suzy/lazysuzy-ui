import { Component, OnInit } from '@angular/core';
import { boardRoutesNames } from '../board.routes.names';

@Component({
  selector: 'app-board-popup',
  templateUrl: './board-popup.component.html',
  styleUrls: ['./board-popup.component.less', '../board.component.less']
})
export class BoardPopupComponent implements OnInit {

  private boardListLink = "../" + boardRoutesNames.BOARD_LIST;

  private roomTypeOptions = [];
  private roomTypeOptionSelected = 0;

  private roomStyleOptions = [];
  private roomStyleOptionSelected = 0;

  private isPrivate = false;
  private boardTitle = "Sample title";

  constructor() { }
  // constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.getRoomTypeAndStyleOptions();
    // console.log(this.data);
  }

  getRoomTypeAndStyleOptions(): void {
    let roomTypeAndStyleOptions = [{
      code: 111,
      label: "Room",
      value: "Living"
    },
    {
      code: 112,
      label: "Room",
      value: "Bedroom"
    },
    {
      code: 113,
      label: "Room",
      value: "Dining"
    },
    {
      code: 114,
      label: "Room",
      value: "Office"
    },
    {
      code: 115,
      label: "Room",
      value: "Nursery/Kids"
    },
    {
      code: 116,
      label: "Room",
      value: "Other"
    },
    {
      code: 121,
      label: "Style",
      value: "Modern"
    },
    {
      code: 122,
      label: "Style",
      value: "Mid-Century"
    },
    {
      code: 123,
      label: "Style",
      value: "Contempor"
    },
    {
      code: 124,
      label: "Style",
      value: "Traditional"
    },
    {
      code: 125,
      label: "Style",
      value: "Bohemian"
    },
    {
      code: 126,
      label: "Style",
      value: "Minamalist"
    },
    {
      code: 127,
      label: "Style",
      value: "Other"
    }];

    this.roomTypeOptions = roomTypeAndStyleOptions.filter(o => o.label == "Room");
    this.roomStyleOptions = roomTypeAndStyleOptions.filter(o => o.label == "Style");
  }

  selectRoomType(index: number) {
    this.roomTypeOptionSelected = index;
  }
  selectRoomStyle(index: number) {
    this.roomStyleOptionSelected = index;
  }

  publishBoard() {
    this.c(this.roomTypeOptions[this.roomTypeOptionSelected], this.roomStyleOptions[this.roomStyleOptionSelected], this.isPrivate, this.boardTitle);
  }
  cancelPublishBoard() {
    // close popup
  }

  c(...message){
    console.log("TAG", message);
  }

}
