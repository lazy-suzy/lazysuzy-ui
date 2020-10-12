import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-board-tutorial-modal',
  templateUrl: './board-tutorial-modal.component.html',
  styleUrls: ['./board-tutorial-modal.component.less']
})
export class BoardTutorialModalComponent implements OnInit {
  isHandset = false;
  constructor(
      private dialogRef:MatDialogRef<BoardTutorialModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.isHandset = data.isHandset;
  }

  ngOnInit() {
  }
  close(){
    this.dialogRef.close();
  };
}
