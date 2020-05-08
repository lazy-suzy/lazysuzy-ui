import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddViaUrlComponent } from './add-via-url/add-via-url.component';
import { BoardService } from 'src/app/shared/services/board/board.service';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

// import * as dropzone from 'dropzone';

@Component({
  selector: 'app-board-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less', '../board.component.less']
})
export class BoardAddComponent implements OnInit {

  myUploads = [];
  allUploads = [];
  myItems = [];

  showLoader = false;
  loaderTypeProgress = true;
  @Input() allAssets: any = [];
  @Input() userId: any = null;
  @Output() previewProduct: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private boardService: BoardService
  ) { }

  ngOnChanges(changes: any) {
    if (changes['userId'] && changes['userId'].previousValue !== changes['userId'].currentValue) {
      let userId = changes['userId'].currentValue || [];
      this.userId = userId;
    }
    if (changes['allAssets'] && changes['allAssets'].previousValue !== changes['allAssets'].currentValue) {
      let allAssets = changes['allAssets'].currentValue || [];
      this.allAssets = [...allAssets] || [];
    }
    this.filterUploads(this.allAssets, this.userId);
  }

  filterUploads(assets,userId){
    this.myUploads = assets.filter(asst=>{
      return asst.user_id == userId;
    });
    this.allUploads = assets.filter(asst=>{
      return asst.user_id == userId;
    });
  }

  ngOnInit(): void {
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
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.boardService.state.myUploads = [...this.myUploads, result];
      this.boardService.state.allUploads = [...this.allUploads, result];
      this.myUploads = [...this.boardService.state.myUploads];
      this.allUploads = [...this.boardService.state.allUploads];
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
      this.showLoader = false;
    });
  }

}
