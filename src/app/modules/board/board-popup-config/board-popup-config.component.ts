import { Component, OnInit, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-board-popup-config',
  templateUrl: './board-popup-config.component.html',
  styleUrls: ['./board-popup-config.component.less', '../board.component.less']
})
export class BoardPopupConfigComponent implements OnInit {

  showBoardPanel;
  showRoomPanel;
  isRoomSelected = false;

  // border: 1px solid #000000;
  backgroundColors = [
    '#ffffff',
    '#d9edf7',
    '#dff0d8',
    '#f3edd2',
    '#c09853',
    '#f2dede',
    '#eeeeee',
    '#4f9ddc',
    '#62c463',
    '#f3c30e',
    '#b94a48',
    '#e85f5b'
  ];
  backgroundImages = [
    environment.BASE_HREF + "/storage/floor1.jpg",
    environment.BASE_HREF + "/storage/floor2.jpg",
    environment.BASE_HREF + "/storage/floor3.jpg",
    environment.BASE_HREF + "/storage/floor4.jpg",
  ];
  selected = {
    color: this.backgroundColors[0],
    background: this.backgroundImages[0]
  };

  @Output() onChange = new EventEmitter();

  constructor(
    @Optional() private dialogRef: MatDialogRef<BoardPopupConfigComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      this.selected.color = data.color || this.selected.color;
    }
  }

  ngOnInit() {
    this.showBoardPanel = false;
    this.showRoomPanel = false;
  }

  handleSelection(selection: string) {
    if (selection == "board") {
      this.showBoardPanel = true;
      this.showRoomPanel = false;
    }
    else if (selection == "room") {
      this.showBoardPanel = false;
      this.showRoomPanel = true;
    }
  }

  handleChange(attribute: string, value: string) {
    this.selected[attribute] = value;
    if(attribute === 'background') {
      this.isRoomSelected = true;
    }
    this.onChange.emit({
      attribute: attribute,
      value: attribute == 'color' ? this.hexToRGB(value) : value,
    });
  }

  save() {
    this.handleChange('action', 'save');
    this.dialogRef.close();
  }

  cancel() {
    this.handleChange('action', 'cancel');
    this.dialogRef.close();
  }

  hexToRGB(h) {
    let r = "0x" + h[1] + h[2];
    let g = "0x" + h[3] + h[4];
    let b = "0x" + h[5] + h[6];
    return "rgb(" + +r + "," + +g + "," + +b + ")";
  }

}
