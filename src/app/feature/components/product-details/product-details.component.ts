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
  product: IProductPayload;
  productSubscription: Subscription;
  selectedIndex: number;
  dimensionExist: boolean;
  featuresExist: boolean;
  descriptionExist: boolean;
  isSwatchExist: boolean;
  galleryId = 'myLightbox';
  items: GalleryItem[];
  isProductFetching = false;
  showDetails = false;
  spinner = 'assets/images/spinner.gif';
  description: any;
  features: any;
  topHeight: Object = { 'max-height': '0' };
  selectedFeature: number;
  selectedAttribute: string;
  selections = {};
  variations = [];
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
        this.variations = this.product.variations;
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

  selectedVariation(variation, index, container) {
    if (variation.has_parent_sku) {
      this.utils.openVariationDialog(variation.variation_sku);
    } else {
      const image = new ImageItem({ src: variation.image });
      this.items.splice(0, 1, image);
      this.selectedIndex = index;
      container.scrollTop = 0;
    }
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

  selectedOption(index, option, type) {
    this.selectedFeature = index;
    this.selectedAttribute = option;
    this.selections[type] = option;
    this.updateSwatches();
  }

  onCheckChange(event, option, type) {
    if (event.source.checked) {
      if (this.selections[type]) {
        this.selections[type].push(option);
      } else {
        this.selections[type] = [option];
      }
    } else {
      const optionsArr = this.selections[type].filter(
        (value: string) => value !== option
      );
      this.selections[type] = optionsArr;
      if (this.selections[type].length < 1) {
        delete this.selections[type];
      }
    }
    this.updateSwatches();
  }

  clearVariations() {
    this.selections = {};
    this.updateSwatches();
  }

  updateSwatches() {
    var _self = this;
    const filteredSwatches = this.product.variations.filter(function(
      variation
    ) {
      if (variation.swatch_image !== null) {
        return _self.checkSwatchSelection(variation, _self);
      }
    });

    const filteredVariations = this.product.variations.filter(function(
      variation
    ) {
      return _self.checkSwatchSelection(variation, _self);
    });
    if (filteredVariations.length === 1) {
      this.productPrice = filteredVariations[0].price;
      const image = new ImageItem({ src: filteredVariations[0].image });
      this.items.splice(0, 1, image);
    } else {
      this.productPrice = this.product.is_price;
      this.items = this.product.on_server_images.map(
        item => new ImageItem({ src: item })
      );
    }
    this.variations = filteredSwatches;
  }

  checkSwatchSelection(variation, _self) {
    let isValidVariation = true;
    for (const key in _self.selections) {
      if (
        variation.features[key] === _self.selections[key] ||
        _self.selections[key].indexOf(variation.features[key]) > -1
      ) {
        isValidVariation = true;
      } else {
        isValidVariation = false;
        break;
      }
    }
    return isValidVariation;
  }
}
