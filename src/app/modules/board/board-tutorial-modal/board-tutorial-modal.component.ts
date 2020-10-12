import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-board-tutorial-modal',
  templateUrl: './board-tutorial-modal.component.html',
  styleUrls: ['./board-tutorial-modal.component.less']
})
export class BoardTutorialModalComponent implements OnInit {

  constructor(
      private dialogRef:MatDialogRef<BoardTutorialModalComponent>
  ) { }

  ngOnInit() {
  }
  close(){
    this.dialogRef.close();
  };
}
