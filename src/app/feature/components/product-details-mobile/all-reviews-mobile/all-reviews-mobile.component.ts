import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService, MatDialogUtilsService, UtilsService} from '../../../../shared/services';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin, Subscription} from 'rxjs';

@Component({
  selector: 'app-all-reviews-mobile',
  templateUrl: './all-reviews-mobile.component.html',
  styleUrls: ['./all-reviews-mobile.component.less']
})
export class AllReviewsMobileComponent implements OnInit, OnDestroy {
  isHandset = false;
  spinner = 'assets/image/spinner.gif';
  routeParamSubscription: Subscription;
  product: any;
  reviewData: any;
  reviews = [];
  currentSortType = '';
  pageNo = 0;
  // Booleans for page
  isPageLoading = false;
  isReviewFetching = false;
  // For Infinite Scroll
  throttle = 300;
  scrollDistance = 2;
  scrollUpDistance = 2;

  constructor(
      private utils: UtilsService,
      private router: Router,
      private activeRoute: ActivatedRoute,
      private apiService: ApiService,
      private matDialogUtilsService: MatDialogUtilsService
  ) {
  }

  ngOnInit() {
    this.utils.isHandset().subscribe(handset => {
      this.isHandset = handset.matches;
    });
    this.routeParamSubscription = this.activeRoute.params.subscribe((routeParams) => {
      const productSku = routeParams.product;
      this.loadProductAndReviews(productSku);
    });
  }

  loadProductAndReviews(productSku: string) {
    this.isPageLoading = true;
    forkJoin(
        this.apiService.getProduct(productSku),
        this.apiService.getProductReviews(productSku, 10)
    ).subscribe(response => {
      this.isPageLoading = false;
      this.product = response[0].product;
      // @ts-ignore
      const {count_rating: totalReviews, tot_rating: rating} = response[1];
      const totNo = Number(totalReviews) * 5;
      const totalRatings = (Number(rating) / totNo) * 100;
      this.reviewData = {
        totalReviews,
        totalRatings,
      };
      if (!this.isHandset) {
        this.matDialogUtilsService.setProduct(response[0]);
        this.router.navigate(
            [`${this.product.department_info[0].category_url}`]
        );
        this.matDialogUtilsService.openAllReviewsModal(this.product, this.reviewData);
      } else {
        this.fetchProductReviews();
      }
    });
  }

  fetchProductReviews() {
    this.isReviewFetching = true;
    this.apiService.getFullReviewList(this.product.sku, this.pageNo, this.currentSortType).subscribe((response: []) => {
      this.reviews = [...this.reviews, ...response];
      this.isReviewFetching = false;
    });
  }

  changeReview(event) {
    this.currentSortType = event.target.value;
    this.pageNo = 0;
    this.reviews = [];
    this.fetchProductReviews();
  }

  onScrollDown() {
    this.pageNo++;
    this.fetchProductReviews();
  }

  openProductPage() {
    this.router.navigateByUrl(`/product/${this.product.sku}`);
  }

  goToReview(sku) {
    this.router.navigateByUrl(`/product/review/${sku}`);
  }

  renderPercentage(num) {
    return Math.round(Number(num) * 0.05);
  }

  ngOnDestroy() {
    this.routeParamSubscription.unsubscribe();
  }
}