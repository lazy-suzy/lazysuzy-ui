import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {IActiveProduct, IProduct, IProductDetail, ISeo} from 'src/app/shared/models';
import {
    ApiService,
    EventEmitterService,
    MatDialogUtilsService,
    SeoService,
    UtilsService
} from 'src/app/shared/services';
import {Gallery, GalleryItem, ImageItem} from '@ngx-gallery/core';
import {Lightbox} from '@ngx-gallery/lightbox';
import {PixelService} from '../../../shared/services/facebook-pixel/pixel.service';
import {first} from 'rxjs/operators';
import {WishlistSnackbarService} from '../../../shared/services/wishlist-service/wishlist-snackbar.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.less']
})
export class ProductDetailsComponent implements OnInit {
    @ViewChild('topContainer', {static: false}) topContainer: ElementRef;
    @ViewChild('gallery', {static: false}) galleryContainer: ElementRef;
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
    topHeight = {'max-height': '0'};
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
    hasValidWasPrice = true;
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
    starIcons = [];
    recentProducts = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        public utils: UtilsService,
        public gallery: Gallery,
        public lightbox: Lightbox,
        private eventEmitterService: EventEmitterService,
        private matDialogUtils: MatDialogUtilsService,
        private seoService: SeoService,
        private pixelService: PixelService,
        private snackBarService: WishlistSnackbarService
    ) {
    }

    ngOnInit(): void {
        this.isProductFetching = true;
        this.loadRecentProducts();
        this.eventSubscription = this.eventEmitterService.userChangeEvent
            .asObservable()
            .subscribe((user) => {
                console.log(user);
                if (this.data.payload) {
                    this.processProduct(this.data.payload, user);
                } else {
                    this.productSubscription = this.apiService
                        .getProduct(this.data.sku)
                        .subscribe(
                            (payload: IProductDetail) => {
                                this.processProduct(payload, user);
                            },
                            (error) => {
                                this.invalidLink = true;
                                this.isProductFetching = false;
                            }
                        );
                }
            });
    }

    loadRecentProducts() {
        this.apiService.getRecentProducts().pipe(first()).subscribe((response: any[]) => {
            this.recentProducts = response;
        });
    }

    setRating(): void {
        this.starIcons = [];
        let starCount = Math.round(this.product.rating * 2) / 2;
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

    private processProduct(payload: IProductDetail, user) {
        this.product = payload.product;
        this.seoData = payload.seo_data;
        if (payload.product) {
            this.setProduct(payload);
            this.setRating();
        } else {
            this.invalidLink = true;
        }
        this.isProductFetching = false;
        this.localStorageUser = user;
    }

    private setProduct(payload: IProductDetail) {
        this.setSeoData(payload);
        this.updateActiveProduct(this.product);
        this.items = this.product.on_server_images.map(
            (item) => new ImageItem({src: item})
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

        if (wasMinPrice <= minPrice) {
            this.hasValidWasPrice = false;
        }
        this.isVariationExist = this.utils.checkDataLength(
            this.product.variations
        );

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
    }

    private setSeoData(payload: IProductDetail) {
        this.schema = this.seoService.setSchema(this.product);
        const seoData: any = payload.seo_data;
        const metaData = {
            title: `${seoData.brand} ${seoData.product_name} | LazySuzy`,
            description: seoData.description,
            image: seoData.image_url,
        };
        this.seoService.setMetaTags(metaData);
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
            this.product.wishlisted = mark;
            this.apiService
                .wishlistProduct(sku, mark, false)
                .subscribe(_ => {
                        if (mark) {
                            this.snackBarService.addToWishlist(sku);
                        } else {
                            this.snackBarService.removeIfExistsProduct(sku);
                        }
                    },
                    error => {
                        this.product.wishlisted = !mark;
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
        this.topHeight = {'max-height': `calc(100vh - ${topHeight + 12}px)`};
    }

    onSetImage(variation): void {
        console.log('setImage entry!');

        this.galleryContainer.nativeElement.scrollTop = 0;
        this.items = this.product.on_server_images.map(
            (item) => new ImageItem({src: item})
        );

        if (variation) {
            const src = variation.image;
            const image = new ImageItem({src});
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
            this.apiService.addCartProduct(postData).subscribe(
                (payload: any) => {
                    if (payload.status) {
                        this.errorMessage = '';
                        this.matDialogUtils.openAddToCartDialog(data);
                        this.pixelService.trackAddToCart(data);
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
        return Array.from({length: maxNumber}, Number.call, (i) => i + 1);
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

    renderPrice(price) {
        const pricesArray = price.split('-');
        let fromPrice = Number(pricesArray[0]);
        let toPrice;
        if (pricesArray.length > 1) {
            toPrice = Number(pricesArray[1]);
        }
        if (!toPrice) {
            return `${this.utils.parsePrice(fromPrice)}`;
        } else {
            return `${this.utils.parsePrice(fromPrice)} - ${this.utils.parsePrice(toPrice)}`;
        }
    }

    isDiscounted(product): boolean {
        product.is_price = product.price;
        const price = this.utils.getPriceObject(product);
        return price.isDiscounted;
    }

    toCollectionProduct(sku) {
        this.matDialogUtils.closeDialogs();
        setTimeout(() => this.matDialogUtils.openMatDialog(sku), 250);

    }
}
