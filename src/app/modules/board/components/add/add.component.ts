import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/shared/services';
import { MatDialog } from '@angular/material';
import { AddViaUrlComponent } from '../add-via-url/add-via-url.component';
import { mockProductsAdd } from './mock-products-add';

// import * as dropzone from 'dropzone';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {

  customProducts = [];
  animal: string;
  name: string;
  allUploads = [];
  myItems = [];
  @Output() previewProduct: EventEmitter<any> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog
  ) {
    // console.log(dropzone);
  }

  ngOnInit(): void {
    this.apiService.getCustomProducts().subscribe((s: any) => {
      this.customProducts = [...mockProductsAdd];
      this.allUploads = [...mockProductsAdd];
      this.myItems = [...mockProductsAdd];
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(AddViaUrlComponent, {
      width: '450px',
      data: {
        name: this.name,
        animal: this.animal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  handlePreviewProduct(product) {
    this.previewProduct.emit(product);
  }

}
