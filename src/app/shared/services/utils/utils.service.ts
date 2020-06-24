import { Injectable, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from 'src/app/core/components';
import { MarkdownService } from 'ngx-markdown';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  signupRef: ElementRef;
  readonly userType = {
    guest: 0,
    default: 1
  };

  constructor(
    public dialog: MatDialog,
    private markdownService: MarkdownService
  ) {}

  closeDialogs() {
    this.dialog.closeAll();
  }

  checkDataLength(data) {
    if (Array.isArray[data]) {
      return data.length > 0 && data[0].length > 0;
    }
    return data.length > 0;
  }

  hasInventory(product) {
    if (product.in_inventory) {
      return (
        product.in_inventory && product.inventory_product_details.count > 0
      );
    } else {
      return false;
    }
  }

  openSignupDialog(isHandset = false, isClose = false) {
    const width = isHandset ? '100%' : '35%';
    // tslint:disable-next-line: no-unused-expression
    !isClose && this.dialog.closeAll();
    return this.dialog.open(SignupComponent, {
      width,

      panelClass: 'auth-dialog-container',
      autoFocus: false
    });
  }

  compileMarkdown(data, site = 'West Elm') {
    let compileData;
    if (site !== 'West Elm') {
      compileData = data.map((item) => `*   ${item}`);
    } else {
      compileData = data;
    }
    let mergedData = '';
    for (const item of compileData) {
      mergedData = `${mergedData}${
        item.indexOf('</h6>') > -1 ? '\n' : ''
      }${item}\n${item.indexOf('</h6>') > -1 ? '\n' : ''}`;
    }
    return this.markdownService.compile(mergedData);
  }
}
