import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-offer-dailog',
    templateUrl: './offer-dailog.component.html',
    styleUrls: ['./offer-dailog.component.less']
})
export class OfferDailogComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<OfferDailogComponent>
    ) {
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }
}
