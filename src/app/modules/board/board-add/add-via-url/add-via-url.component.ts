import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService } from '../../board.service';
import { Asset } from '../../asset';

@Component({
  selector: 'app-add-via-url',
  templateUrl: './add-via-url.component.html',
  styleUrls: ['./add-via-url.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AddViaUrlComponent implements OnInit {

  showLoader = false;
  loaderTypeProgress = true;

  constructor(
    public dialogRef: MatDialogRef<AddViaUrlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private boardService: BoardService) { }

  ngOnInit(): void { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(data): void {
    this.dialogRef.close(data);
  }

  handleStepperUpdates(payload) {
    console.log("Here handle stepper updates");
    if (payload.name === 'cancel') {
      this.onNoClick();
    }
    else if (payload.name === 'add-image-via-url') {
      this.showLoader = true;
      payload = payload.data;
      let asset = new Asset({
        name: payload.productTitle,
        price: payload.price,
        brand: 'Custom',
        // path: payload.imageUrl,
        // transparent_path: payload.productListingUrl,
        is_private: payload.keepPrivate == true ? 1 : 0,
        url: payload.imageUrl
        // file:
      });
      this.boardService.addAsset(asset).subscribe(res => {
        this.showLoader = false;
        this.onYesClick(res);
      });
    }
  }

}
