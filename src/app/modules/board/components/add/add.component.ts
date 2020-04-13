import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddViaUrlComponent } from '../add-via-url/add-via-url.component';
import { BoardService } from 'src/app/shared/services/board/board.service';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

// import * as dropzone from 'dropzone';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {

  myUploads = [];
  allUploads = [];
  myItems = [];

  showLoader = false;
  loaderTypeProgress = true;
 
  @Output() previewProduct: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
    this.myUploads = [...this.boardService.myUploads];
    this.allUploads = [...this.boardService.allUploads];

    this.uploader.onBeforeUploadItem = (item: FileItem) => {
      item.withCredentials = false;
      // this.uploader.authToken = 'Bearer ' + this.boxTokenResponse.userToken;
      // this.uploader.options.additionalParameter = {
      //   name: item.file.name,
      //   parent_id: this.parentFolderId
      // };

    };
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddViaUrlComponent, {
      width: '450px',
      data: {
        name: '',
        panelClass: 'my-dialog',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      let myUploads = this.boardService.myUploads;
      let allUploads = this.boardService.allUploads;
      this.boardService.myUploads = [...myUploads, result];
      this.boardService.allUploads = [...allUploads, result];
      this.myUploads = [...this.boardService.myUploads];
      this.allUploads = [...this.boardService.allUploads];
    });
  }

  handlePreviewProduct(product) {
    this.previewProduct.emit(product);
  }

  public uploader: FileUploader = new FileUploader({
    disableMultipart: false,
    itemAlias: 'attachment',
    allowedFileType: ['image']
  });

  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    this.boardService.uploadFileManual(file).subscribe(res => {
      console.log("Response here");
      debugger;
      this.showLoader = false;
    });
  }

}
