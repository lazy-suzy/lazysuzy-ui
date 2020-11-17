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
    errorText: string;
    submitted = false;

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
