import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '../../../shared/services';

@Component({
    selector: 'app-newsletter-popup',
    templateUrl: './newsletter-popup.component.html',
    styleUrls: ['./newsletter-popup.component.less']
})
export class NewsletterPopupComponent implements OnInit {
    email: string;
    errorText: string;
    submitted = false;
    isHandset = false;
    desktopImageUrl = 'https://lazysuzy.com/images/landing/PopSignBlkFri.png';
    mobileImageUrl = 'https://lazysuzy.com/images/landing/PopSignBlkFriM.jpg';

    constructor(
        private dialogRef: MatDialogRef<NewsletterPopupComponent>,
        private apiService: ApiService,
        @Inject(MAT_DIALOG_DATA) public data
    ) {
    }

    setStyles() {
        return {
            'background-image': `url('${this.isHandset ? this.mobileImageUrl : this.desktopImageUrl}')`,
            'background-size': this.isHandset ? 'contain' : 'cover',
        };
    }

    ngOnInit() {
        this.isHandset = this.data.handset;
    }

    onClose() {
        this.dialogRef.close();
    }

    submitEmail() {
        const emailMatch = this.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
        if (!emailMatch) {
            this.errorText = 'Please Enter a valid Email address';
            return;
        }
        if (this.email && emailMatch) {
            this.apiService.subscription('PopupForm', this.email).subscribe((response: any) => {
                this.submitted = true;
            });
        }
    }
}
