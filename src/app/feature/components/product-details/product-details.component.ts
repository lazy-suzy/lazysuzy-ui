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
  IActiveProduct,
  IProduct,
  ISeo
} from 'src/app/shared/models';
import {
  ApiService,
  UtilsService,
  EventEmitterService,
  MatDialogUtilsService,
  SeoService
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
  product: IProduct;
  seoData: ISeo;
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
  isProductFetching = true;
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
  hasValidWasPrice =true;
  quantity = 1;
  quantityArray = [];
  galleryRef = this.gallery.ref(this.galleryId);
  isSetItemInInventory = false;
  localStorageUser = {};
  activeProduct: IActiveProduct;
  hasSelection: boolean;
  beforeSelection: boolean;
  checkSelection: boolean;
  schema = {};
  invalidLinkImageSrc = 'assets/image/invalid_link.png';
  invalidLink: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    public utils: UtilsService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private eventEmitterService: EventEmitterService,
    private matDialogUtils: MatDialogUtilsService,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
    this.isProductFetching = true;

    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.productSubscription = this.apiService
          .getProduct(this.data.sku)
          .subscribe(
            (payload: IProductDetail) => {
              this.product = payload.product;
              console.log('this.product: ', this.product);
              this.seoData = payload.seo_data;
              if (payload.product) {
                this.schema = this.seoService.setSchema(this.product);
                this.seoService.setMetaTagsProduct(this.seoData);
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
                  this.productPrice = this.utils.formatPrice(
                    this.product.is_price
                  );

                  this.productWasPrice = this.utils.formatPrice(
                    this.product.was_price
                  );

                }
                const minPrice = Number(this.productPrice.split('-')[0]);
                const wasMinPrice = Number(this.productWasPrice.split('-')[0]);

                if(wasMinPrice<=minPrice)
                {
                  this.hasValidWasPrice = false;
                }
                this.isVariationExist = this.utils.checkDataLength(
                  this.product.variations
                );
                console.log('this.isVariationExist: ', this.isVariationExist);

                if (!this.isVariationExist) {
                  this.beforeSelection = true;
                  this.checkSelection = true;
                }
                this.hasVariationsInventory();
                this.variations = this.product.variations.sort((a, b) =>
                  a.name > b.name ? 1 : -1
                );
                if (this.product.set) {
                  this.checkSetInventory(this.product.set);
                }
                const self = this;
                setTimeout(() => {
                  self.getMaxHeight();
                }, 1000);
                this.invalidLink = false;
              } else {
                this.invalidLink = true;
              }
              this.isProductFetching = false;
              this.localStorageUser = user;
            },
            (error) => {
              this.invalidLink = true;
              this.isProductFetching = false;
            }
          );
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
    console.log('setImage entry!');

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
    console.log('this.product.in_inventory: ', this.product.in_inventory);
    console.log('this.activeProduct.inventory_product_details.price: ', this.activeProduct.inventory_product_details.price);
    console.log('this.twoPlus: ', !this.product.in_inventory && !this.activeProduct.inventory_product_details.price);
    console.log('this.beforeSelection: ', this.beforeSelection);
    if (
      !this.activeProduct.in_inventory &&
      !this.activeProduct.inventory_product_details.price ||
      !this.beforeSelection
    ) {
      this.hasSelection = false;
    } else {
      this.hasSelection = true;
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
      console.log('postData: ', postData);
      console.log('hasSelection: ', this.hasSelection);

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
    console.log('this.activeProduct: ', this.activeProduct);
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

  onSetSelectionChecked(e: boolean) {
    console.log('set Selection checked: ', e);
    this.beforeSelection = e;
  }

  onClearSelection(e: boolean) {
    console.log('onClear selections!');
    this.checkSelection = e;
  }

  onSetSelection(e: boolean) {
    this.hasSelection = e;
  }
}
