import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../../../shared/services';

@Component({
    selector: 'app-secondary-banner',
    templateUrl: './secondary-banner.component.html',
    styleUrls: ['./secondary-banner.component.less']
})
export class SecondaryBannerComponent implements OnInit {
    @Input() isHandset = false;
    bannerImages;

    constructor(private apiService: ApiService) {
    }

    ngOnInit(): void {
        this.apiService.bannerData().subscribe((res: []) => {
            this.bannerImages = res.filter((value: any) => value.position === 'secondary');
        });
    }

    toLink(link) {
        window.location.href = link;
    }

}
