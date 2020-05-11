import { Component, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { MatDialog } from '@angular/material';
import { UploadFileDetailsComponent } from './upload-file-details/upload-file-details.component';
import { BoardService } from '../../board.service';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer } from '@angular/platform-browser';

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
  localImageUrl = null;

  constructor(
    public dialog: MatDialog,
    private cookie: CookieService,
    public sanitizer: DomSanitizer
  ) {
    this.initUploader();
  }

  initUploader() {
    this.localImageUrl = null;
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
    this.uploader.onAfterAddingFile = (fileItem) => {
      let url = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
      this.localImageUrl = url
    }
    this.hasAnotherDropZoneOver = false;
    this.uploader.response.subscribe(res => {
      this.handleFileUploadSuccess(res);
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
  }

  handleFileUploadSuccess(res) {
    const response = JSON.parse(res);
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
    // this.uploader.queue.pop();
    // this.localImageUrl = null
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