import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from 'src/app/feature/components';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(public dialog: MatDialog, private location: Location) {}

  checkDataLength(data) {
    return data.length > 0;
  }

  openMatDialog(modalSku) {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '80%',
      height: '100%',
      data: { sku: modalSku },
      panelClass: 'product-details-dialog-container'
    });
    dialogRef.afterOpened().subscribe(result => {
      this.location.go(`product/${modalSku}`);
    });
    dialogRef.afterClosed().subscribe(result => {
      this.location.back();
    });
  }

  openVariationDialog(modalSku) {
    const dialogRef = this.dialog.open(ProductDetailsComponent, {
      width: '80%',
      height: '100%',
      data: { sku: modalSku },
      panelClass: 'product-details-dialog-container'
    });
    dialogRef.afterOpened().subscribe(result => {
      this.location.replaceState(`product/${modalSku}`);
    });
    dialogRef.afterClosed().subscribe(result => {
      this.location.back();
    });
  }
}
