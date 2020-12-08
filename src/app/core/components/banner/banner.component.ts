import {Component, OnInit, Input} from '@angular/core';
import {ApiService} from './../../../shared/services';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.less']
})
export class BannerComponent implements OnInit {
    bannerData: any;
    isBanner = true;
    @Input() isHandset = false;

    constructor(
        private apiService: ApiService,
    ) {
    }

    ngOnInit() {
        this.apiService.bannerData().subscribe((res: any[]) => {
            this.bannerData = res.filter(value => value.position === 'primary');
        });
    }
}
