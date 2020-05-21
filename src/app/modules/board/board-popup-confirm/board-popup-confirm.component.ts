import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-board-popup-confirm',
  templateUrl: 'board-popup-confirm.component.html',
  styleUrls: ['../board.component.less']
})
export class BoardPopupConfirmComponent implements OnInit {

  popupData = {
    title: "Are you sure?",
    optionConfirm: "Confirm",
    optionCancel: "Cancel"
  };

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) private data: any, @Optional() private dialogRef: MatDialogRef<BoardPopupConfirmComponent>) { 
    if(data){
      this.popupData.title = data.title || this.popupData.title;
      this.popupData.optionConfirm = data.optionConfirm || this.popupData.optionConfirm;
      this.popupData.optionCancel = data.optionCancel || this.popupData.optionCancel;
    }
  }

  ngOnInit() {
  }

  action(actionToTake = false) {
    this.dialogRef.close(actionToTake);
  }

}
