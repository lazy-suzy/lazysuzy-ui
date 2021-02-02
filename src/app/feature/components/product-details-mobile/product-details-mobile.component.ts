import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IActiveProduct, IProduct, IProductDetail, ISeo} from 'src/app/shared/models';
import {
    ApiService,
    CacheService,
    EventEmitterService,
    MatDialogUtilsService,
    SeoService,
    UtilsService,
} from 'src/app/shared/services';
import {Observable, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Gallery, GalleryItem, ImageItem} from '@ngx-gallery/core';
import {Lightbox} from '@ngx-gallery/lightbox';
import {VariationsComponent} from '../variations/variations.component';
import {PixelService} from '../../../shared/services/facebook-pixel/pixel.service';
import {WishlistSnackbarService} from '../../../shared/services/wishlist-service/wishlist-snackbar.service';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-product-details-mobile',
    templateUrl: './product-details-mobile.component.html',
    styleUrls: ['./product-details-mobile.component.less'],
})
export class ProductDetailsMobileComponent implements OnInit {
    @ViewChild(VariationsComponent, {static: false}) child: VariationsComponent;
    @ViewChild('gallery', {static: false}) galleryContainer: ElementRef<any>;
    @ViewChild('itemTemplate', {static: true}) itemTemplate: TemplateRef<any>;
    @ViewChild('thumbTemplate', {static: true}) thumbTemplate: TemplateRef<any>;

    productSku: any;
    routeSubscription: any;
    product: IProduct;
    seoData: ISeo;
    productSubscription: Subscription;
    activeTab = 'desc';
    dimensionExist = false;
    featuresExist = false;
    descriptionExist = false;
    assemblyExist = false;
    careExist = false;
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
    isProductFetching = true;
    description: any;
    features: any;
    productPrice: any;
    productWasPrice: any;
    variations = [];
    selectedSwatch = {
        swatch_image: null,
        price: '',
        wasPrice: '',
    };
    errorMessage = '';
    quantity = 1;
    quantityArray = [];
    galleryRef = this.gallery.ref(this.galleryId);
    isSetItemInInventory = false;
    eventSubscription: Subscription;
    activeProduct: IActiveProduct;
    hasSelection: boolean;
    beforeSelection: boolean;
    checkSelection: boolean;
    schema = {};
    invalidLinkImageSrc = 'assets/image/invalid_link.png';
    invalidLink: boolean;
    isSingleDimension: boolean;
    priceObject = {
        is_price: '',
        was_price: '',
    };
    isDiscounted = false;
    isRange = false;
    carousalOptions = {
        autoWidth: false,
        loop: true,
        margin: 10,
        items: 2.3,
        center: false,
        dots: false,
        pagination: false,
    };
    recentProducts = [];
    recentOptions = {
        autoWidth: false,
        loop: true,
        margin: 10,
        items: 2.3,
        center: false,
        dots: false,
        pagination: false,
    };

    imageDialogCarouselOptions = {
        margin: 10,
        loop: true,
        items: 1,
        dots: true,
        touchDrag: false,
        pagination: true,
        // autoWidth: true,
        // stagePadding: 100,
        singleItem: true,
    };
    recentReviews: any;
    allReviews: any;
    totalCount: any;
    lowestReviews: any;
    totalRating: number;
    highestReviews: any;
    totalNo: number;
    currentReviewSelection = 'mr';

    assembly: any;
    care: any;
    otherPeopleProducts = [];

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
        private matDialogUtils: MatDialogUtilsService,
        private seoService: SeoService,
        private pixelService: PixelService,
        private snackBarService: WishlistSnackbarService
    ) {
    }

    ngOnInit() {
        this.loadRecentProducts();
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
        this.routeSubscription = this.activeRoute.params.subscribe(
            (routeParams) => {
                this.isProductFetching = true;
                this.productSku = routeParams.product;
                this.cacheService.data.productSku = this.productSku;
                this.cacheService.data.useCache = true;
                this.productSubscription = this.apiService
                    .getProduct(this.productSku)
                    .subscribe(
                        (payload: IProductDetail) => {
                            this.product = payload.product;
                            if (this.product.collections.length < 3) {
                                this.carousalOptions.loop = false;
                            }
                            this.seoData = payload.seo_data;
                            if (this.product) {
                                this.schema = this.seoService.setSchema(this.product);
                                this.seoService.setMetaTags(this.seoData);
                                this.updateActiveProduct(this.product);
                                this.description = this.utils.compileMarkdown(
                                    this.product.description,
                                    true
                                );
                                this.features = this.utils.compileMarkdown(
                                    this.product.features
                                );
                                this.dimensionExist = this.utils.checkDimensionsLength(
                                    this.product.dimension
                                );
                                this.isSingleDimension = (this.product.dimension.length === 1);
                                this.featuresExist = this.utils.checkDataLength(
                                    this.product.features
                                );
                                if (this.product.product_assembly != null) {
                                    this.assemblyExist = this.utils.checkDataLength(
                                        this.product.product_assembly
                                    );
                                }
                                if (this.product.product_care != null) {
                                    this.careExist = this.utils.checkDataLength(
                                        this.product.product_care
                                    );
                                }
                                this.assembly = this.utils.compileMarkdownText(this.product.product_assembly);
                                this.care = this.utils.compileMarkdownText(this.product.product_care);
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
                                if (!this.isVariationExist) {
                                    this.beforeSelection = true;
                                    this.checkSelection = true;
                                }
                                if (
                                    this.isVariationExist &&
                                    this.product.variations.length === 1
                                ) {
                                    this.beforeSelection = true;
                                    this.checkSelection = true;
                                }
                                this.hasVariationsInventory();
                                if (!this.isHandset) {
                                    this.matDialogUtils.setProduct(payload);
                                    this.router.navigate(
                                        [`${this.product.department_info[0].category_url}`],
                                        {queryParams: {modal_sku: this.product.sku}}
                                    );
                                }
                                this.variations = this.product.variations.sort((a, b) =>
                                    a.name > b.name ? 1 : -1
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

                                const {
                                    isPriceString,
                                    isRanged,
                                    isDiscounted,
                                    wasPriceString,
                                } = this.utils.getPriceObject(this.product);
                                this.priceObject.is_price = isPriceString;
                                this.priceObject.was_price = wasPriceString;
                                this.isRange = isRanged;
                                this.isDiscounted = isDiscounted;
                                this.createGalleryItems(this.product.on_server_images);
                                if (this.product.set) {
                                    this.checkSetInventory(this.product.set);
                                }
                                this.loadOtherPeopleProducts();
                                this.invalidLink = false;
                            } else {
                                this.invalidLink = true;
                            }
                            this.isProductFetching = false;
                        },
                        (error) => {
                            this.invalidLink = true;
                            this.isProductFetching = false;
                        }
                    );
                this.loadProductReviews(this.productSku);
            }
        );
    }

    loadProductReviews(sku) {
        const limit = 10;
        this.apiService.getProductReviews(sku, limit).subscribe((response: any) => {
            this.recentReviews = response;
            if (
                this.recentReviews.all_reviews &&
                this.recentReviews.all_reviews.length > 0
            ) {
                this.allReviews = this.recentReviews.all_reviews;
                this.totalCount = this.recentReviews.count_rating;
                this.totalNo = Number(this.recentReviews.count_rating) * 5;
                this.totalRating =
                    (Number(this.recentReviews.tot_rating) / this.totalNo) * 100;
            }
            if (
                this.recentReviews.highest_reviews &&
                this.recentReviews.highest_reviews.length > 0
            ) {
                this.highestReviews = this.recentReviews.highest_reviews;
            }
            if (
                this.recentReviews.lowest_reviews &&
                this.recentReviews.lowest_reviews.length > 0
            ) {
                this.lowestReviews = this.recentReviews.lowest_reviews;
            }
        });
    }

    objKeys(anObject) {
        if (anObject) {
            return Object.keys(anObject);
        }
        return [];
    }

    changeReview(event) {
        this.currentReviewSelection = event.target.value;
    }

    createGalleryItems(items: any[]) {
        this.items = items.map((item) => new ImageItem({src: item, thumb: item}));
        this.galleryRef.setConfig({
            imageSize: 'contain',
            // itemTemplate: this.itemTemplate,
            // thumbTemplate: this.thumbTemplate,
            gestures: false,
            thumb: true,
            thumbWidth: 90,
        });
        this.galleryRef.load(this.items);
    }

    onDestroy(): void {
        this.productSubscription.unsubscribe();
        this.bpSubscription.unsubscribe();
        this.eventSubscription.unsubscribe();
    }

    loadRecentProducts() {
        this.apiService
            .getRecentProducts()
            .pipe(first())
            .subscribe((response: any[]) => {
                this.recentProducts = response;
                if (this.recentProducts.length < 2) {
                    this.recentOptions.loop = false;
                }
            });
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
                wasPrice: variation.was_price,
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
                if (mark) {
                    this.snackBarService.addToWishlist(sku);
                } else {
                    this.snackBarService.removeIfExistsProduct(sku);
                }
            });
    }

    openLightbox(index: number) {
        this.lightbox.open(index, this.galleryId, {
            panelClass: 'fullscreen',
        });
        const intercom = document.getElementsByClassName(
            'intercom-lightweight-app'
        )[0];
        if (intercom) {
            intercom.classList.add('hidden');
        }
        this.lightbox.closed.pipe(first()).subscribe((_) => {
            intercom.classList.remove('hidden');
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
            (item) => new ImageItem({src: item, thumb: item})
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
            // this.hasSelection = false;
        }
        this.galleryRef.load(this.items);
    }

    onSetPrice(priceData): void {
        const newPrices = {
            is_price: priceData.price,
            was_price: priceData.wasPrice,
        };
        const {
            isPriceString,
            isRanged,
            isDiscounted,
            wasPriceString,
        } = this.utils.getPriceObject(newPrices || this.product);
        this.priceObject.is_price = isPriceString;
        this.priceObject.was_price = wasPriceString;
        this.isRange = isRanged;
        this.isDiscounted = isDiscounted;
        this.galleryContainer.nativeElement.scrollTo({
            left: 0,
            behavior: 'smooth',
        });
    }

    openCartModal() {
        if (
            (!this.product.in_inventory &&
                !this.activeProduct.inventory_product_details.price) ||
            !this.beforeSelection
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
                price: Number(this.priceObject.is_price.replace(/[^0-9.-]+/g, '')),
                quantity: this.quantity,
            };
            const postData = {
                product_sku: this.activeProduct.sku,
                count: this.quantity,
                parent_sku: this.product.sku,
            };
            this.apiService.addCartProduct(postData).subscribe(
                (payload: any) => {
                    if (payload.status) {
                        this.errorMessage = '';
                        this.pixelService.trackAddToCart(data);
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
        if (product.site === 'West Elm' && this.product.variations.length === 1) {
            this.activeProduct = {
                sku: product.variations[0].variation_sku,
                in_inventory: product.variations[0].in_inventory,
                name: product.variations[0].name,
                inventory_product_details:
                product.variations[0].inventory_product_details,
            };
        } else {
            this.activeProduct = {
                sku: product.variation_sku ? product.variation_sku : product.sku,
                in_inventory: product.in_inventory,
                name: product.name,
                inventory_product_details: product.inventory_product_details
                    ? product.inventory_product_details
                    : [],
            };
        }
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
        this.hasSelection = e;
        this.checkSelection = e;
    }

    onSetSelection(e: boolean) {
        this.hasSelection = e;
    }

    renderPrice(price, wasPrice = false) {
        return this.utils.formatPriceMobile(price, wasPrice);
    }

    isDiscountedCollectionPrice(product): boolean {
        product.is_price = product.price;
        const price = this.utils.getPriceObject(product);
        return price.isDiscounted;
    }

    toCollectionProduct(product) {
        this.router.navigate(['/product', product.sku]);
    }

    openMyReviewModal() {
        this.hasSelection = true;
        const data = {
            sku: this.activeProduct.sku,
            brand: this.product.site,
            image: this.product.main_image,
            name:
                this.activeProduct.sku === this.product.sku
                    ? this.activeProduct.name
                    : this.product.name + ' ' + this.activeProduct.name,
            price: this.productPrice,
            quantity: this.quantity,
        };
        const postData = {
            product_sku: this.activeProduct.sku,
            count: this.quantity,
            parent_sku: this.product.sku,
        };
        this.matDialogUtils.openMyReviewDialog(data);
    }

    openAllReviewsPage() {
        this.router.navigate(['/product', 'view-reviews', this.productSku]);
    }

    goToReview(sku) {
        console.log(sku);
        // window.location.href = './product/review/' + sku;
        this.router.navigateByUrl(`/product/review/${sku}`);
    }

    loadOtherPeopleProducts() {
        this.apiService.getOtherPeopleProducts(this.product.sku).subscribe((response: any[]) => {
            this.otherPeopleProducts = response;
        });
    }
}
