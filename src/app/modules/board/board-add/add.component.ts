import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddViaUrlComponent } from './add-via-url/add-via-url.component';
import { BoardService } from 'src/app/shared/services/board/board.service';
import { environment as env } from 'src/environments/environment';
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
  isAsset = true;
  @Input() allAssets: any = [];
  @Input() userId: any = null;
  @Output() previewProduct: EventEmitter<any> = new EventEmitter();
  @Output() updateAsset: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog, private boardService: BoardService) {}

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(changes: any) {
    if (
      changes.userId &&
      changes.userId.previousValue !== changes.userId.currentValue
    ) {
      const userId = changes.userId.currentValue || [];
      this.userId = userId;
    }
    if (
      changes.allAssets &&
      changes.allAssets.previousValue !== changes.allAssets.currentValue
    ) {
      const allAssets = changes.allAssets.currentValue || [];
      this.allAssets = [...allAssets] || [];
      this.isAsset = !this.isAsset;
      this.allAssets = this.allAssets.map((ele, i) => {
        return {
          ...ele,
          refId: i
        };
      });
    }
    this.filterUploads(this.allAssets, this.userId);
  }

  filterUploads(assets, userId) {
    this.myUploads = assets.filter((asst) => {
      return asst.user_id === userId;
    });
    this.allUploads = assets.filter((asst) => {
      return asst.is_private === 0;
    });
  }

  handleFileUploadSuccess(event) {
    this.updateAssets(event.response);
  }

  updateAssets(data) {
    data.board_thumb = `${env.BASE_HREF}${data.path}`;
    data.dropType = 'custom';
    this.allAssets = this.allAssets.map((elem) => ({
      ...elem,
      board_thumb: `${env.BASE_HREF}${elem.path}`,
      dropType: 'custom'
    }));
    this.allAssets.unshift(data);
    // this.allAssets = [...this.allAssets];
    this.filterUploads(this.allAssets, this.userId);
    this.updateAsset.emit(this.allAssets);
    this.isAsset = !this.isAsset;
  }

  ngOnInit(): void {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddViaUrlComponent, {
      width: '450px',
      data: {
        name: '',
        panelClass: 'my-dialog'
      },
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.boardService.state.myUploads = [...this.myUploads, result];
        this.boardService.state.allUploads = [...this.allUploads, result];
        this.myUploads = [...this.boardService.state.myUploads];
        this.allUploads = [...this.boardService.state.allUploads];
        this.updateAssets(result);
      }
    });
  }

  handlePreviewProduct(product) {
    this.previewProduct.emit(product);
  }
}
