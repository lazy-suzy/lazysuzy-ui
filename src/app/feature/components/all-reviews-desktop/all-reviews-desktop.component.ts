import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ApiService} from '../../../shared/services';

@Component({
    selector: 'app-all-reviews-desktop',
    templateUrl: './all-reviews-desktop.component.html',
    styleUrls: ['./all-reviews-desktop.component.less']
})
export class AllReviewsDesktopComponent implements OnInit {

    reviews = [];
    spinner = 'assets/image/spinner.gif';
    isReviewFetching = false;
    pageNo = 0;
    product: any;
    reviewData: any;
    currentSortType = '';
    // For Infinite Scroll
    throttle = 300;
    scrollDistance = 0.1;
    scrollUpDistance = 2;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
    ) {
    }

    ngOnInit() {
        this.product = this.data.product;
        this.reviewData = this.data.reviewsData;
        this.fetchProductReviews();
    }

    fetchProductReviews() {
        this.isReviewFetching = true;
        this.apiService.getFullReviewList(this.product.sku, this.pageNo, this.currentSortType).subscribe((response: []) => {
            this.reviews = [...this.reviews, ...response];
            this.isReviewFetching = false;
        });
    }

    changeSort(sort) {
        this.currentSortType = sort;
        this.pageNo = 0;
        this.reviews = [];
        this.fetchProductReviews();
    }

    renderPercentage(num) {
        return Math.round(Number(num) * 0.05);
    }

    onScrollDown() {
        this.pageNo++;
        this.fetchProductReviews();
    }
}
