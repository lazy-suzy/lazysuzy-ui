import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IProductPayload } from 'src/app/shared/models';
import {
  ApiService,
  UtilsService,
  CacheService
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
  product: IProductPayload;
  productSubscription: Subscription;
  activeTab: string = 'desc';
  dimensionExist: boolean = false;
  featuresExist: boolean = false;
  descriptionExist: boolean = false;
  spinner: string = 'assets/images/spinner.gif';
  bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.Handset
  );
  galleryId = 'myLightbox';
  items: GalleryItem[];
  bpSubscription: Subscription;
  isHandset: boolean;
  variationsExist: boolean;
  selectedIndex: any;
  isProductFetching: boolean = false;
  description: any;
  features: any;
  productPrice: string;
  productWasPrice: string;
  variations = [];
  swatches = [];
  selectedSwatch = {
    swatch_image: null,
    price: '',
    wasPrice: ''
  };
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private utils: UtilsService,
    private breakpointObserver: BreakpointObserver,
    public gallery: Gallery,
    public lightbox: Lightbox,
    public cacheService: CacheService
  ) {}

  ngOnInit() {
    this.bpSubscription = this.bpObserver.subscribe(
      (handset: BreakpointState) => {
        this.isHandset = handset.matches;
      }
    );
    this.loadProduct();
  }

  loadProduct() {
    this.isProductFetching = true;
    this.routeSubscription = this.activeRoute.params.subscribe(routeParams => {
      this.productSku = routeParams.product;
      this.cacheService.data.productSku = this.productSku;
      this.cacheService.data.useCache = true;
    });
    this.productSubscription = this.apiService
      .getProduct(this.productSku)
      .subscribe((payload: IProductPayload) => {
        this.product = payload;
        this.description = this.utils.compileMarkdown(this.product.description);
        this.features = this.utils.compileMarkdown(this.product.features);
        this.dimensionExist = this.utils.checkDataLength(
          this.product.dimension
        );
        this.featuresExist = this.utils.checkDataLength(this.product.features);
        this.descriptionExist = this.utils.checkDataLength(
          this.product.description
        );
        this.variationsExist = this.utils.checkDataLength(
          this.product.variations
        );
        if (!this.isHandset) {
          this.router.navigate(
            [`${this.product.department_info[0].category_url}`],
            { queryParams: { modal_sku: this.product.sku } }
          );
        }
        this.swatches = this.product.variations;
        this.productPrice = this.product.is_price;
        this.productWasPrice = this.product.was_price;
        const galleryRef = this.gallery.ref(this.galleryId);
        this.items = this.product.on_server_images.map(
          item => new ImageItem({ src: item })
        );
        galleryRef.load(this.items);
        this.isProductFetching = false;
      });
  }
  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
    this.bpSubscription.unsubscribe();
  }

  selectTab(tab) {
    this.activeTab = tab;
  }

  selectedVariation(variation, index, container) {
    if (variation.has_parent_sku) {
      this.router.navigate([`/product/${variation.variation_sku}`]);
      this.loadProduct();
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

  wishlistProduct(sku, mark) {
    this.apiService.wishlistProduct(sku, mark).subscribe((payload: any) => {
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
  onSetImage(src): void {
    // this.galleryContainer.nativeElement.scrollTop = 0;
    this.items = this.product.on_server_images.map(
      item => new ImageItem({ src: item })
    );
    if (src) {
      const image = new ImageItem({ src });
      this.items.splice(0, 0, image);
    }
  }
  onSetPrice(priceData): void {
    this.productPrice = priceData.price || this.product.is_price;
    this.productWasPrice = priceData.wasPrice || this.product.was_price;
  }
  setSwatches(updatedSwatches): void {
    this.swatches = updatedSwatches;
    if (
      this.selectedSwatch.swatch_image &&
      this.swatches.some(
        data => data.swatch_image === this.selectedSwatch.swatch_image
      )
    ) {
      this.productPrice = this.selectedSwatch.price;
      this.productWasPrice = this.selectedSwatch.wasPrice;
    } else {
      this.selectedSwatch = {
        swatch_image: null,
        price: '',
        wasPrice: ''
      };
      this.items = this.product.on_server_images.map(
        item => new ImageItem({ src: item })
      );
      this.productPrice = this.product.is_price;
      this.productWasPrice = this.product.was_price;
      this.selectedIndex = null;
    }
  }
  clearVariations() {
    this.selectedSwatch = {
      swatch_image: null,
      price: '',
      wasPrice: ''
    };
    this.productPrice = this.product.is_price;
    this.productWasPrice = this.product.was_price;
    this.selectedIndex = null;
    this.items = this.product.on_server_images.map(
      item => new ImageItem({ src: item })
    );
    this.child.clearVariations();
  }
}
