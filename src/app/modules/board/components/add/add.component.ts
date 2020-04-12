import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddViaUrlComponent } from '../add-via-url/add-via-url.component';
import { BoardService } from 'src/app/shared/services/board/board.service';

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

  @Output() previewProduct: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
    this.myUploads = [...this.boardService.myUploads];
    this.allUploads = [...this.boardService.allUploads];
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

}
