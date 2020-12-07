import {Component, OnInit} from '@angular/core';
import {ApiService} from 'src/app/shared/services';

@Component({
    selector: 'app-featured-brands',
    templateUrl: './featured-brands.component.html',
    styleUrls: ['./featured-brands.component.less']
})
export class FeaturedBrandsComponent implements OnInit {

    bannerImages;

    constructor(private apiService: ApiService) {
    }

    ngOnInit(): void {
        this.apiService.bannerData().subscribe((res: []) => {
            this.bannerImages = res.filter((value: any) => value.position === 'secondary');
        });
    }

}
