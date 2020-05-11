import { Component, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { MatDialog } from '@angular/material';
import { UploadFileDetailsComponent } from './upload-file-details/upload-file-details.component';
import { BoardService } from '../../board.service';
import { CookieService } from 'ngx-cookie-service';

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
  @Output() fileUploadedChanges = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog,
    private cookie: CookieService
  ) {
    this.initUploader();
  }

  initUploader() {
    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: false,
      authToken: `Bearer ${this.cookie.get('token')}`,
    });
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      for (let [key, value] of Object.entries(this.currentAsset)) {
        form.append(key, value);
      }
    };
    this.hasAnotherDropZoneOver = false;
    this.uploader.response.subscribe(res => {
      // this.handleFileUploadSuccess();
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
  }

  handleFileUploadSuccess() {
    const response = {
      "asset_id": 16,
      "user_id": 1,
      "name": "custom",
      "price": null,
      "brand": "custom",
      "path": "uploads\/E52185BD-59C0-0682-6CCF-E2F461AACB0A.jpeg",
      "transparent_path": null,
      "is_private": 1,
      "created_at": "2020-05-10 00:41:09",
      "modified_at": "2020-05-10 00:41:09",
      "is_active": 1
    };
    this.fileUploadedChanges.emit({
      response: response
    });
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  clearEverything() {
    this.uploader.queue.forEach(file => {
      file.remove();
    });
  }

  handleUpload() {
    this.openDialog();
  }

  handleCancelUpload() {
    this.uploader.clearQueue();
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
        const asset = result.data;
        this.currentAsset = { ...this.currentAsset, ...asset };
        //MIKE: NOTE
        this.uploader.uploadAll();
        //Comment above line and uncomment below line to simulate success file upload.
        // this.handleFileUploadSuccess();
      }
      else if (result.name === 'cancel-save-image-details') {
        this.clearEverything();
      }
    });
  }

}