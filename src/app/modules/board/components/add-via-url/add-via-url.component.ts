import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-via-url',
  templateUrl: './add-via-url.component.html',
  styleUrls: ['./add-via-url.component.less']
})
export class AddViaUrlComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddViaUrlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(data): void {
    this.dialogRef.close(data);
  }

  ngOnInit(): void { }

}
