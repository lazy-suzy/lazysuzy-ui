import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
    selector: 'app-offer-dailog',
    templateUrl: './offer-dailog.component.html',
    styleUrls: ['./offer-dailog.component.less']
})
export class OfferDailogComponent implements OnInit {
    deals: any;

    constructor(
        private dialogRef: MatDialogRef<OfferDailogComponent>,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.deals = data.deals;
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

    toOfferPage(url) {
        this.close();
        this.router.navigate(['/', url]);
    }
}
