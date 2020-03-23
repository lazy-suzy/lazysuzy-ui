import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IProductPayload } from 'src/app/shared/models';
import { ApiService, UtilsService } from 'src/app/shared/services';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import { Gallery, GalleryItem, ImageItem } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
@Component({
  selector: 'app-product-details-mobile',
  templateUrl: './product-details-mobile.component.html',
  styleUrls: ['./product-details-mobile.component.less']
})
export class ProductDetailsMobileComponent implements OnInit {
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

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private utils: UtilsService,
    private breakpointObserver: BreakpointObserver,
    public gallery: Gallery,
    public lightbox: Lightbox
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
      const image = new ImageItem({ src: variation.image });
      this.items.splice(0, 1, image);
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
      vglnk.open(url);
    }
  }
}
