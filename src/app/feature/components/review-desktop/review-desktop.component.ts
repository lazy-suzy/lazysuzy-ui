import {Component, Input, OnInit} from '@angular/core';
import {Gallery, GalleryItem, ImageItem} from '@ngx-gallery/core';
import {Lightbox} from '@ngx-gallery/lightbox';
import {ApiService} from '../../../shared/services';

@Component({
    selector: 'app-review-desktop',
    templateUrl: './review-desktop.component.html',
    styleUrls: ['./review-desktop.component.less']
})
export class ReviewDesktopComponent implements OnInit {

    @Input() review: any;
    @Input() galleryId: any;
    items: GalleryItem[] | any;
    galleryRef;
    markedHelpful = false;
    markedReported = false;

    constructor(
        public gallery: Gallery,
        public lightbox: Lightbox,
        private apiService: ApiService
    ) {
    }

    ngOnInit() {
        this.galleryRef = this.gallery.ref(this.galleryId);
        if (this.review.review_images) {
            const images = this.review.review_images.split(',').filter(value => value);
            this.createGalleryItems(images);
        }
    }

    createGalleryItems(items: any[]) {
        this.items = items.map((item) => new ImageItem({src: item, thumb: item}));
        const lightboxGalleryRef = this.gallery.ref(this.galleryRef);
        // 3. Load the items into the lightbox
        lightboxGalleryRef.load(this.items);
        // this.galleryRef.load(this.items);
    }

    markHelpful() {
        const user: any = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.apiService.markReviewHelpful(user.id, this.review.id).subscribe((response: any) => {
                this.markedHelpful = true;
            });
        }
    }

    reportReview() {
        const user: any = JSON.parse(localStorage.getItem('user'));
        if (user) {
            this.apiService.reportReview(user.id, this.review.id).subscribe((response: any) => {
                this.markedReported = true;
            });
        }
    }
}
