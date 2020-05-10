import { Component, Output, EventEmitter } from '@angular/core';
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
  @Output() fileUploadedChanges = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog
  ) {
    this.initUploader();
  }

  initUploader() {
    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: false,
      headers: [{ name: 'Authorization', value: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJhY2ZhYjk5OTljNjAzOTJmZDdiNDcxZjBmNWU4OTc4N2FkY2E5Zjc3NWFjZTEyYzYwMmYyOGZiMmJhMDEyYjZiY2Q1OTg5Yzk3YWNjMjA2In0.eyJhdWQiOiIzIiwianRpIjoiMmFjZmFiOTk5OWM2MDM5MmZkN2I0NzFmMGY1ZTg5Nzg3YWRjYTlmNzc1YWNlMTJjNjAyZjI4ZmIyYmEwMTJiNmJjZDU5ODljOTdhY2MyMDYiLCJpYXQiOjE1ODg5NjM0ODYsIm5iZiI6MTU4ODk2MzQ4NiwiZXhwIjoxNjIwNDk5NDg2LCJzdWIiOiIxMDkiLCJzY29wZXMiOltdfQ.U9fIcMZmXiFgUpTOuJFwJq3JJ6NegfTxhfd7tcEkTf2P9vgbLpZvr2THEuQ9kDv3Cy1G_Ig6c2Vjzh7Jv_eBhUEMrbBc5nAaUklzprU6gBubRWdGeQOAm-iVxvufGCxCoa-8Os_2AfBRONf2Ow3VyB-njQvoBSd9PCOCsoMUgO3Yyz8CaHR9Jd4oZOx7083sNSJmWZKtyA2UuErHvyvLXFbFCU5KAtWtyUunfamhcI7uPYw9HAq-fGKwOWxrzcIe8JLtyWQ2J6rNze_VMaqXFBXCp3_hkh_cmtT9qMZzPyt1DZru6BKkidn1pX2OWtjlhw9-fgWa3lJ2WcQY6Go8RelUFYka-6XIKdBFSVdZPUNACcDH__rFCzuu3rU9rfl22lqN84khO1LmmiBJRAdWcRRPS0XMHsQ9SYHhVeUKboU_LVHI_hXr0xXrxkJMZwT91aVLYLy0XQqmpmCmyOWmIMZgkKEbuFzZkYc94ZlRpRABUjb7kLKbETFqEtG3K_k59n04jlwD7Qf8SE6g9UtIzb7WMgFhdIwCcKTZRk1wqR7xyYQ_g5alsR03GNL_ZnovHRQSCyRWl4n8W0Q1Y6l7MC42ZT8a5VQZgEnvkfNNbnqslqyNe-e0n8YZIQZHkkllP4jbOSRn2f0Nfa1LC_I5zoEG87uyTyt53Ak0HgeCOaQ' }]
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
  }

  handleFileUploadSuccess(){
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

  clearEverything(){
    this.uploader.queue.forEach(file=>{
      file.remove();
    });
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