import {Component, Input, OnInit} from '@angular/core';
import {Gallery, GalleryItem, ImageItem} from '@ngx-gallery/core';
import {Lightbox} from '@ngx-gallery/lightbox';

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

    constructor(
        public gallery: Gallery,
        public lightbox: Lightbox,
    ) {
    }

    ngOnInit() {
        this.galleryRef = this.gallery.ref(this.galleryId);
        if (this.review.review_images) {
            const images = this.review.review_images.split(',').filter(value => value);
            this.createGalleryItems(images);
        }
    }
    openLightbox(index: number) {
        this.lightbox.open(index, this.galleryId, {
            panelClass: 'fullscreen',
        });
    }
    createGalleryItems(items: any[]) {
        this.items = items.map((item) => new ImageItem({src: item, thumb: item}));
        const lightboxGalleryRef = this.gallery.ref(this.galleryRef);
        // 3. Load the items into the lightbox
        lightboxGalleryRef.load(this.items);
        // this.galleryRef.load(this.items);
    }
}