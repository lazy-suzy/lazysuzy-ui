import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Optional,
  Inject
} from '@angular/core';
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
  currentTab;
  isOptionSelected = false;
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
    'https://www.lazysuzy.com/images/board/rooms/blue_gray_1610.jpg',
    'https://www.lazysuzy.com/images/board/rooms/dining_dark_wood_1610.jpg',
    'https://www.lazysuzy.com/images/board/rooms/light_wood_1610.jpg',
    'https://www.lazysuzy.com/images/board/rooms/medium_wood_1610.jpg'
  ];
  backgroundImagesThumbs = [
    'https://www.lazysuzy.com/images/board/rooms/blue_gray_1610_thumb.jpg',
    'https://www.lazysuzy.com/images/board/rooms/dining_dark_wood_1610_thumb.jpg',
    'https://www.lazysuzy.com/images/board/rooms/light_wood_1610_thumb.jpg',
    'https://www.lazysuzy.com/images/board/rooms/medium_wood_1610_thumb.jpg'
  ];
  selected = {
    color: this.backgroundColors[0],
    background: this.backgroundImages[0]
  };

  // tslint:disable-next-line: no-output-on-prefix
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
    this.currentTab = selection;
    if (selection === 'board') {
      this.isOptionSelected = true;
      this.showBoardPanel = true;
      this.showRoomPanel = false;
    } else if (selection === 'room') {
      this.showBoardPanel = false;
      if (this.isRoomSelected) {
        this.isOptionSelected = true;
      } else {
        this.isOptionSelected = false;
      }
      this.showRoomPanel = true;
    }
  }

  handleChange(attribute: string, value: string) {
    this.selected[attribute] = value;
    if (attribute === 'background') {
      this.isOptionSelected = true;
      this.isRoomSelected = true;
    }
    this.onChange.emit({
      attribute,
      value: attribute === 'color' ? this.hexToRGB(value) : value
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
    const r = '0x' + h[1] + h[2];
    const g = '0x' + h[3] + h[4];
    const b = '0x' + h[5] + h[6];
    return 'rgb(' + +r + ',' + +g + ',' + +b + ')';
  }
}
