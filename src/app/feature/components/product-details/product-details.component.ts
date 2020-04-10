import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IProductPayload } from 'src/app/shared/models';
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
  product: IProductPayload;
  productSubscription: Subscription;
  selectedIndex: number;
  dimensionExist: boolean;
  featuresExist: boolean;
  descriptionExist: boolean;
  isSwatchExist: boolean;
  isVariationExist: boolean;
  galleryId = 'myLightbox';
  items: GalleryItem[];
  isProductFetching = false;
  showDetails = false;
  spinner = 'assets/images/spinner.gif';
  description: any;
  features: any;
  topHeight: Object = { 'max-height': '0' };
  productPrice: string;
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
      .subscribe((payload: IProductPayload) => {
        this.product = payload;
        const galleryRef = this.gallery.ref(this.galleryId);
        this.items = this.product.on_server_images.map(
          item => new ImageItem({ src: item })
        );
        galleryRef.load(this.items);
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
        this.productPrice = this.product.is_price;
        this.isVariationExist = this.utils.checkDataLength(
          this.product.variations
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

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  wishlistProduct(sku, mark) {
    this.apiService.wishlistProduct(sku, mark).subscribe((payload: any) => {
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
  }
  onSetPrice(price): void {
    this.productPrice = price || this.product.is_price;
  }
}
