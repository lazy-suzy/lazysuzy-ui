import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { MatDialog } from '@angular/material';
import { UploadFileDetailsComponent } from './upload-file-details/upload-file-details.component';
import { BoardService } from '../../board.service';

const URL = 'http://staging.lazysuzy.com:8081/api/board/asset';

@Component({
  selector: 'app-add-file-upload',
  templateUrl: './add-file-upload.component.html',
  styleUrls: ['./add-file-upload.component.less']
})
export class AddFileUploadComponent {

  uploader: FileUploader;
  hasAnotherDropZoneOver: boolean;
  currentAsset: any = {};

  constructor(
    public dialog: MatDialog,
    private boardService: BoardService
  ) {
    this.initUploader();
  }

  initUploader() {
    this.uploader = new FileUploader({});
    this.uploader.onAfterAddingFile = (fileItem) => {
      this.currentAsset.file = fileItem.file.rawFile;
    };
    this.hasAnotherDropZoneOver = false;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  handleUpload() {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UploadFileDetailsComponent, {
      width: '450px',
      data: {
        name: '',
        panelClass: 'my-dialog',
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.name === 'save-image-details') {
        let asset = {
          "name": "testfile",
          "price": "120",
          "brand": "Custom",
          "is_private": false
        };
        this.currentAsset = { ...this.currentAsset, ...asset };
        debugger;
        //To Ask Mike
        this.boardService.addAsset(this.currentAsset).subscribe(res => {

        });
      }
      else if (result.name === '') {

      }
    });
  }

}