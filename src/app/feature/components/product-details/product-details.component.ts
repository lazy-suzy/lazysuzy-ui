import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  IProductPayload,
  IProductDetail,
  IActiveProduct
} from 'src/app/shared/models';
import {
  ApiService,
  UtilsService,
  EventEmitterService,
  MatDialogUtilsService
} from 'src/app/shared/services';
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
  eventSubscription: Subscription;
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
  spinner = 'assets/image/spinner.gif';
  description: any;
  features: any;
  productPrice: any;
  productWasPrice: any;
  variations = [];
  topHeight = { 'max-height': '0' };
  swatches = [];
  errorMessage = '';
  priceData = {
    price: '',
    wasPrice: ''
  };
  selectedSwatch = {
    swatch_image: null,
    price: '',
    wasPrice: ''
  };
  quantity = 1;
  quantityArray = [];
  galleryRef = this.gallery.ref(this.galleryId);
  isSetItemInInventory = false;
  localStorageUser = {};
  activeProduct: IActiveProduct;
  hasSelection: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public utils: UtilsService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private eventEmitterService: EventEmitterService,
    private matDialogUtils: MatDialogUtilsService
  ) {}

  ngOnInit(): void {
    this.isProductFetching = true;

    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.productSubscription = this.apiService
          .getProduct(this.data.sku)
          .subscribe((payload: IProductDetail) => {
            this.product = payload;
            this.updateActiveProduct(this.product);
            this.items = this.product.on_server_images.map(
              (item) => new ImageItem({ src: item })
            );
            this.galleryRef.load(this.items);
            this.description = this.utils.compileMarkdown(
              this.product.description
            );
            this.features = this.utils.compileMarkdown(
              this.product.features,
              this.product.site
            );
            this.dimensionExist = this.utils.checkDataLength(
              this.product.dimension
            );
            this.featuresExist = this.utils.checkDataLength(
              this.product.features
            );
            this.descriptionExist = this.utils.checkDataLength(
              this.product.description
            );
            this.isSwatchExist = this.utils.checkDataLength(
              this.product.variations.filter(
                (variation) => variation.swatch_image !== null
              )
            );
            if (this.product.in_inventory) {
              this.productPrice = this.utils.formatPrice(
                this.product.inventory_product_details.price
              );
              this.productWasPrice = this.utils.formatPrice(
                this.product.inventory_product_details.was_price
              );
            } else {
              this.productPrice = this.utils.formatPrice(this.product.is_price);
              this.productWasPrice = this.utils.formatPrice(
                this.product.was_price
              );
            }
            this.isVariationExist = this.utils.checkDataLength(
              this.product.variations
            );
            this.hasVariationsInventory();
            this.variations = this.product.variations.sort((a, b) =>
              a.name > b.name ? 1 : -1
            );
            if (this.product.set) {
              this.checkSetInventory(this.product.set);
            }
            this.isProductFetching = false;
            const self = this;
            setTimeout(() => {
              self.getMaxHeight();
            }, 1000);
          });
        this.localStorageUser = user;
      });
  }

  onDestroy(): void {
    this.productSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
  }

  openLightbox(index: number) {
    this.lightbox.open(index, this.galleryId, {
      panelClass: 'fullscreen'
    });
  }

  checkSetInventory(product) {
    for (const item of product) {
      if (item.in_inventory) {
        this.isSetItemInInventory = true;
      }
    }
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  wishlistProduct(sku, mark) {
    const localData: any = this.localStorageUser;
    if (localData.email.length > 0) {
      this.apiService
        .wishlistProduct(sku, mark, false)
        .subscribe((payload: any) => {
          this.product.wishlisted = mark;
        });
    }
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
  onSetImage(variation): void {
    this.galleryContainer.nativeElement.scrollTop = 0;
    this.items = this.product.on_server_images.map(
      (item) => new ImageItem({ src: item })
    );
    if (variation) {
      const src = variation.image;
      const image = new ImageItem({ src });
      this.items.splice(0, 0, image);
      this.updateActiveProduct(variation);
      this.hasSelection = true;
    } else {
      this.updateActiveProduct(this.product);
      this.hasVariationsInventory();
    }
    this.galleryRef.load(this.items);
  }
  onSetPrice(priceData): void {
    this.productPrice = this.utils.formatPrice(
      priceData.price || this.product.is_price
    );
    this.productWasPrice = this.utils.formatPrice(
      priceData.wasPrice || this.product.was_price
    );
  }

  openCartModal() {
    if (
      !this.product.in_inventory &&
      !this.activeProduct.inventory_product_details.price
    ) {
      this.hasSelection = false;
    } else {
      const data = {
        sku: this.activeProduct.sku,
        brand: this.product.site,
        image: this.items[0].data.src,
        name:
          this.activeProduct.sku === this.product.sku
            ? this.activeProduct.name
            : this.product.name + ' ' + this.activeProduct.name,
        price: this.productPrice,
        quantity: this.quantity
      };
      const postData = {
        product_sku: this.activeProduct.sku,
        count: this.quantity,
        parent_sku: this.product.sku
      };

      this.apiService.addCartProduct(postData).subscribe(
        (payload: any) => {
          if (payload.status) {
            this.errorMessage = '';
            this.matDialogUtils.openAddToCartDialog(data);
          } else {
            this.errorMessage = payload.msg;
          }
        },
        (error: any) => {
          this.errorMessage = 'Cannot add this product at the moment.';
          console.log(error);
        }
      );
    }
  }

  updateActiveProduct(product) {
    this.activeProduct = {
      sku: product.variation_sku ? product.variation_sku : product.sku,
      in_inventory: product.in_inventory,
      name: product.name,
      inventory_product_details: product.inventory_product_details
        ? product.inventory_product_details
        : []
    };
  }

  quantityLimit(count) {
    const maxNumber = count < 10 ? count : 10;
    return Array.from({ length: maxNumber }, Number.call, (i) => i + 1);
  }

  hasVariationsInventory() {
    if (
      this.isVariationExist &&
      this.product.inventory_product_details === null
    ) {
      if (this.product.variations.find((item) => item.in_inventory === true)) {
        this.activeProduct.in_inventory = true;
        this.activeProduct.inventory_product_details.count = 1;
      }
    }
  }
}
