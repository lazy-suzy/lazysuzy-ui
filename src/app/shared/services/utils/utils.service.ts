import { Injectable, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from 'src/app/core/components';
import { MarkdownService } from 'ngx-markdown';
import { environment as env } from 'src/environments/environment';

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

  updateBoardLike(board, like) {
    return (
      (board.is_liked = like),
      (board.like_count = like ? board.like_count + 1 : board.like_count - 1)
    );
  }

  updateProfileImageLink(picture) {
    return picture.includes('http') ? picture : env.BASE_HREF + picture;
  }

  formatPrice(price) {
    if (price) {
      const priceString = price.toString();
      let minRange;
      let maxRange;
      let result;
      const splitedPrice = priceString.split('-');
      minRange = parseFloat(splitedPrice[0]).toFixed(2);
      if (splitedPrice.length > 1) {
        maxRange = parseFloat(splitedPrice[1]).toFixed(2);
        result = minRange.toString() + ' - ' + maxRange.toString();
      } else {
        maxRange = null;
        result = minRange.toString();
      }
      return result;
    } else {
      return;
    }
  }
}
