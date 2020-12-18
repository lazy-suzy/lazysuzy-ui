import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef} from '@angular/material';

@Component({
    selector: 'app-wishlist-snackbar',
    templateUrl: './wishlist-snackbar.component.html',
    styleUrls: ['./wishlist-snackbar.component.less']
})
export class WishlistSnackbarComponent implements OnInit, OnDestroy, AfterViewInit {
    isGuest = false;

    constructor(
        public snackBarRef: MatSnackBarRef<WishlistSnackbarComponent>,
        @Inject(MAT_SNACK_BAR_DATA) public data: string
    ) {
        this.isGuest = (data === 'guest');
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        setTimeout(() => {
            const intercom = document.getElementsByClassName('intercom-lightweight-app')[0];
            if (intercom) {
                intercom.classList.add('visible-none');
            }
        }, 200);
    }

    ngOnDestroy() {
        const intercom = document.getElementsByClassName('intercom-lightweight-app')[0];
        if (intercom) {
            intercom.classList.remove('visible-none');
        }
    }
}
