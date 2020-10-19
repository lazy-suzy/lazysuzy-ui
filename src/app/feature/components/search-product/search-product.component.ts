import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from './../product-details/product-details.component';
import { ISearchProduct } from './../../../shared/models';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import { ApiService, MatDialogUtilsService } from 'src/app/shared/services';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.less']
})
export class SearchProductComponent implements OnInit {
  @Input() product: ISearchProduct;
  @Input() productsInRow = 0;
  starIcons: string[] = new Array();
  bpSubscription: Subscription;
  isHandset: boolean;
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  priceObject = {
    isPrice:0,
    wasPrice:0
  };
  isDiscounted = false;
  isRange = false;
  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private apiService: ApiService,
    private router: Router,
    private matDialogUtils: MatDialogUtilsService
  ) {}

  ngOnInit(): void {
    this.setRating();
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    this.formatPriceText(this.product);
  }

  onDestroy(): void {
    this.bpSubscription.unsubscribe();
  }

  setRating(): void {
    let starCount = Math.round(parseFloat(this.product.rating) * 2) / 2;
    while (starCount > 0.5) {
      this.starIcons.push('star');
      starCount -= 1;
    }
    if (starCount && this.starIcons.length < 5) {
      this.starIcons.push('star_half');
    } else if (this.starIcons.length < 5) {
      while (this.starIcons.length < 5) {
        this.starIcons.push('star_outline');
      }
    }
  }

  openDialog(): void {
    if (this.isHandset) {
      this.router.navigateByUrl(`/product/${this.product.product_sku}`);
    } else {
      this.matDialogUtils.openMatDialog(this.product.product_sku);
    }
  }

  wishlistProduct(sku, mark, event) {
    event.stopPropagation();
    this.apiService
      .wishlistProduct(sku, mark, this.isHandset)
      .subscribe((payload: any) => {
        // this.product.wishlisted = mark;
      });
  }

  formatPriceText(product){
    let {max_price,min_price,was_price} = product;
    was_price = was_price.split('-');
    if(max_price!=min_price){
      this.isRange = true;
    }
    this.priceObject.isPrice = Number(min_price);
    this.isDiscounted = was_price && was_price[0] > min_price;
    if(this.isDiscounted){
      this.priceObject.wasPrice = Number(was_price[0]);
    }
  }
  renderPrice(price:number):number|string{
    const quotient = Math.floor(price);
    let remainder = Number((price - quotient).toPrecision(2));
    if(remainder == 0){
      return quotient;
    }
    else{
      return  price.toFixed(2);
    }
    return 0;
  }
}
