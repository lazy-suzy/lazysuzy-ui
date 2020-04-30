import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IProductPayload, IProductDetail } from 'src/app/shared/models';
import { ApiService, UtilsService } from 'src/app/shared/services';
import { Gallery, GalleryItem, ImageItem } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.less']
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('topContainer', { static: false }) topContainer: ElementRef;
  @ViewChild('gallery', { static: false }) galleryContainer: ElementRef;
  product: IProductDetail;
  productSubscription: Subscription;
  selectedIndex: number;
  dimensionExist: boolean;
  featuresExist: boolean;
  descriptionExist: boolean;
  isSwatchExist: boolean;
  isVariationExist: boolean;
  galleryId = 'myLightbox';
  items: GalleryItem[];
  isProductFetching: boolean = false;
  showDetails: boolean = false;
  spinner: string = 'assets/images/spinner.gif';
  description: any;
  features: any;
  productPrice: any;
  productWasPrice: any;
  variations = [];
  topHeight: Object = { 'max-height': '0' };
  swatches = [];
  priceData = {
    price: '',
    wasPrice: ''
  };
  selectedSwatch = {
    swatch_image: null,
    price: '',
    wasPrice: ''
  };
  quantity: number = 1;
  quantityArray = [];
  galleryRef = this.gallery.ref(this.galleryId);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private utils: UtilsService,
    public gallery: Gallery,
    public lightbox: Lightbox
  ) {}

  ngOnInit(): void {
    this.isProductFetching = true;
    this.productSubscription = this.apiService
      .getProduct(this.data.sku)
      .subscribe((payload: IProductDetail) => {
        this.product = payload;
        this.items = this.product.on_server_images.map(
          item => new ImageItem({ src: item })
        );
        this.galleryRef.load(this.items);
        this.description = this.utils.compileMarkdown(this.product.description);
        this.features = this.utils.compileMarkdown(this.product.features);
        this.dimensionExist = this.utils.checkDataLength(
          this.product.dimension
        );
        this.featuresExist = this.utils.checkDataLength(this.product.features);
        this.descriptionExist = this.utils.checkDataLength(
          this.product.description
        );
        this.isSwatchExist = this.utils.checkDataLength(
          this.product.variations.filter(
            variation => variation.swatch_image !== null
          )
        );
        if (this.product.in_inventory) {
          this.productPrice = this.product.inventory_product_details.price;
          this.productWasPrice = this.product.inventory_product_details.price;
          for (let i = 1; i <= this.product.inventory_product_details.count; i++) {
            this.quantityArray.push({value: i});
          }
        } else {
          this.productPrice = this.product.is_price;
          this.productWasPrice = this.product.was_price;
        }
        this.isVariationExist = this.utils.checkDataLength(
          this.product.variations
        );
        this.variations = this.product.variations.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
        this.isProductFetching = false;
        const _self = this;
        setTimeout(function() {
          _self.getMaxHeight();
        }, 1000);
      });
  }

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    // this.getMaxHeight();
  }

  openLightbox(index: number) {
    this.lightbox.open(index, this.galleryId, {
      panelClass: 'fullscreen'
    });
  }

  // selectedVariation(variation, index, container) {
  //   if (variation.has_parent_sku) {
  //     this.utils.openVariationDialog(variation.variation_sku);
  //   } else {
  //     this.selectedSwatch = {
  //       swatch_image: variation.swatch_image,
  //       price: variation.price,
  //       wasPrice: variation.was_price
  //     };
  //     this.productPrice = variation.price;
  //     this.productWasPrice = variation.was_price;
  //     this.onSetImage(variation.image);
  //     this.selectedIndex = index;
  //     container.scrollTop = 0;
  //   }
  // }
  isArray(obj: any) {
    return Array.isArray(obj);
  }

  wishlistProduct(sku, mark) {
    this.apiService
      .wishlistProduct(sku, mark, false)
      .subscribe((payload: any) => {
        this.product.wishlisted = mark;
      });
  }

  openLink(event, url) {
    event.preventDefault();
    if (typeof vglnk) {
      vglnk.open(url, '_blank');
    }
  }
  getMaxHeight() {
    const topHeight =
      this.topContainer && (this.topContainer.nativeElement.offsetHeight || 0);
    this.topHeight = { 'max-height': `calc(100vh - ${topHeight + 12}px)` };
  }
  onSetImage(src): void {
    this.galleryContainer.nativeElement.scrollTop = 0;
    this.items = this.product.on_server_images.map(
      item => new ImageItem({ src: item })
    );
    if (src) {
      const image = new ImageItem({ src });
      this.items.splice(0, 0, image);
    }
    this.galleryRef.load(this.items);
  }
  onSetPrice(priceData): void {
    this.productPrice = priceData.price || this.product.is_price;
    this.productWasPrice = priceData.wasPrice || this.product.was_price;
  }

  openCartModal() {
    const data = {
      sku: this.data.sku,
      brand: this.product.site,
      image: this.items[0].data.src,
      name: this.product.name,
      price: this.productPrice,
      quantity: this.quantity
    };
    const postData = {
      product_sku: this.data.sku,
      count: this.quantity
    };
    this.apiService.addCartProduct(postData).subscribe(
      (payload: any) => {
        this.utils.openAddToCartDialog(data);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
