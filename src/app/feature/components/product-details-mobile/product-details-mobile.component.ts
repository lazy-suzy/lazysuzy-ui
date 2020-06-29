import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IActiveProduct, IProductDetail } from 'src/app/shared/models';
import {
  ApiService,
  UtilsService,
  CacheService,
  EventEmitterService,
  MatDialogUtilsService
} from 'src/app/shared/services';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import { Gallery, GalleryItem, ImageItem } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { VariationsComponent } from '../variations/variations.component';

@Component({
  selector: 'app-product-details-mobile',
  templateUrl: './product-details-mobile.component.html',
  styleUrls: ['./product-details-mobile.component.less']
})
export class ProductDetailsMobileComponent implements OnInit {
  @ViewChild(VariationsComponent, { static: false }) child: VariationsComponent;
  productSku: any;
  routeSubscription: any;
  product: IProductDetail;
  productSubscription: Subscription;
  activeTab = 'desc';
  dimensionExist = false;
  featuresExist = false;
  descriptionExist = false;
  spinner = 'assets/image/spinner.gif';
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  galleryId = 'myLightbox';
  items: GalleryItem[];
  bpSubscription: Subscription;
  isHandset: boolean;
  isVariationExist: boolean;
  selectedIndex: any;
  isSwatchExist: boolean;
  isProductFetching = false;
  description: any;
  features: any;
  productPrice: any;
  productWasPrice: any;
  variations = [];
  selectedSwatch = {
    swatch_image: null,
    price: '',
    wasPrice: ''
  };
  errorMessage = '';
  quantity = 1;
  quantityArray = [];
  galleryRef = this.gallery.ref(this.galleryId);
  isSetItemInInventory = false;
  eventSubscription: Subscription;
  activeProduct: IActiveProduct;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    public utils: UtilsService,
    private breakpointObserver: BreakpointObserver,
    public gallery: Gallery,
    public lightbox: Lightbox,
    public cacheService: CacheService,
    private eventEmitterService: EventEmitterService,
    private matDialogUtils: MatDialogUtilsService
  ) {}

  ngOnInit() {
    this.eventSubscription = this.eventEmitterService.userChangeEvent
      .asObservable()
      .subscribe((user) => {
        this.bpSubscription = this.bpObserver.subscribe(
          (handset: BreakpointState) => {
            this.isHandset = handset.matches;
          }
        );
        this.loadProduct();
      });
  }

  loadProduct() {
    this.isProductFetching = true;
    this.routeSubscription = this.activeRoute.params.subscribe(
      (routeParams) => {
        this.productSku = routeParams.product;
        this.cacheService.data.productSku = this.productSku;
        this.cacheService.data.useCache = true;
      }
    );
    this.productSubscription = this.apiService
      .getProduct(this.productSku)
      .subscribe((payload: IProductDetail) => {
        this.product = payload;
        this.updateActiveProduct(this.product);
        this.description = this.utils.compileMarkdown(this.product.description);
        this.features = this.utils.compileMarkdown(
          this.product.features,
          this.product.site
        );
        this.dimensionExist = this.utils.checkDataLength(
          this.product.dimension
        );
        this.featuresExist = this.utils.checkDataLength(this.product.features);
        this.descriptionExist = this.utils.checkDataLength(
          this.product.description
        );
        this.isSwatchExist = this.utils.checkDataLength(
          this.product.variations.filter(
            (variation) => variation.swatch_image !== null
          )
        );
        this.isVariationExist = this.utils.checkDataLength(
          this.product.variations
        );
        this.hasVariationsInventory();
        if (!this.isHandset) {
          this.router.navigate(
            [`${this.product.department_info[0].category_url}`],
            { queryParams: { modal_sku: this.product.sku } }
          );
        }
        this.variations = this.product.variations.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
        if (this.product.in_inventory) {
          this.productPrice = this.product.inventory_product_details.price;
          this.productWasPrice = this.product.inventory_product_details.was_price;
        } else {
          this.productPrice = this.product.is_price;
          this.productWasPrice = this.product.was_price;
        }
        this.items = this.product.on_server_images.map(
          (item) => new ImageItem({ src: item })
        );
        if (this.product.set) {
          this.checkSetInventory(this.product.set);
        }
        this.galleryRef.load(this.items);
        this.isProductFetching = false;
      });
  }
  onDestroy(): void {
    this.productSubscription.unsubscribe();
    this.bpSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
  }

  selectTab(tab) {
    this.activeTab = tab;
  }

  selectedVariation(variation, index, container) {
    if (variation.has_parent_sku) {
      this.router.navigate([`/product/${variation.variation_sku}`]);
    } else {
      this.selectedSwatch = {
        swatch_image: variation.swatch_image,
        price: variation.price,
        wasPrice: variation.was_price
      };
      this.productPrice = variation.price;
      this.productWasPrice = variation.was_price;
      this.onSetImage(variation.image);
      this.selectedIndex = index;
      container.scrollLeft = 0;
    }
  }
  onVariationChange() {
    this.loadProduct();
  }
  wishlistProduct(sku, mark) {
    this.apiService
      .wishlistProduct(sku, mark, true)
      .subscribe((payload: any) => {
        this.product.wishlisted = mark;
      });
  }

  openLightbox(index: number) {
    this.lightbox.open(index, this.galleryId, {
      panelClass: 'fullscreen'
    });
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  openLink(event, url) {
    event.preventDefault();
    if (typeof vglnk) {
      vglnk.open(url, '_blank');
    }
  }
  onSetImage(variation): void {
    // this.galleryContainer.nativeElement.scrollTop = 0;
    this.items = this.product.on_server_images.map(
      (item) => new ImageItem({ src: item })
    );
    if (variation) {
      const src = variation.image;
      const image = new ImageItem({ src });
      this.items.splice(0, 0, image);
      this.updateActiveProduct(variation);
    } else {
      this.updateActiveProduct(this.product);
      this.hasVariationsInventory();
    }
    this.galleryRef.load(this.items);
  }
  onSetPrice(priceData): void {
    this.productPrice = priceData.price || this.product.is_price;
    this.productWasPrice = priceData.wasPrice || this.product.was_price;
  }
  openCartModal() {
    if (
      !this.product.in_inventory &&
      !this.activeProduct.inventory_product_details.price
    ) {
      this.errorMessage = 'Please select a variation';
      const self = this;
      setTimeout(() => {
        self.errorMessage = '';
      }, 3000);
    } else {
      const data = {
        sku: this.productSku,
        brand: this.product.site,
        image: this.items[0].data.src,
        name: this.product.name,
        price: this.productPrice,
        quantity: this.quantity
      };
      const postData = {
        product_sku: this.productSku,
        count: this.quantity
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
  checkSetInventory(product) {
    for (const item of product) {
      if (item.in_inventory) {
        this.isSetItemInInventory = true;
      }
    }
  }
  updateActiveProduct(product) {
    this.activeProduct = {
      sku: product.variation_sku ? product.variation_sku : product.sku,
      in_inventory: product.in_inventory,
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
