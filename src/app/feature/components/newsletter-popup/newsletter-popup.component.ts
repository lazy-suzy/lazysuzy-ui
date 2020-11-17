import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ApiService} from '../../../shared/services';

@Component({
    selector: 'app-newsletter-popup',
    templateUrl: './newsletter-popup.component.html',
    styleUrls: ['./newsletter-popup.component.less']
})
export class NewsletterPopupComponent implements OnInit {
    email: string;

    constructor(
        private dialogRef: MatDialogRef<NewsletterPopupComponent>,
        private apiService: ApiService
    ) {
    }

    ngOnInit() {
    }

    onClose() {
        this.dialogRef.close();
    }

    submitEmail() {
        if (this.email && this.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            this.apiService.subscriptionAll(this.email).subscribe(response => {
                this.onClose();
            });
        }
    }
}
