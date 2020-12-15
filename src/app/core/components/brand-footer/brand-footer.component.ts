import {AfterViewInit, Component, Input, NgZone, OnInit} from '@angular/core';
import {ApiService, EventEmitterService} from '../../../shared/services';

import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

declare var AOS: any;

@Component({
    selector: 'app-brand-footer',
    templateUrl: './brand-footer.component.html',
    styleUrls: ['./brand-footer.component.less'],
})
export class BrandFooterComponent implements OnInit, AfterViewInit {
    eventSubscription: Subscription;
    featuredBrands = [];
    @Input() isHandset = false;

    constructor(
        private apiService: ApiService,
        private eventEmitterService: EventEmitterService,
        private ngZone: NgZone,
        private router: Router
    ) {
    }

    brands: any;

    ngOnInit() {
        this.eventSubscription = this.eventEmitterService.userChangeEvent
            .asObservable()
            .subscribe((user) => {
                this.getbrands();

            });
    }

    ngAfterViewInit() {

    }

    onnDestroy(): void {
        this.eventSubscription.unsubscribe();
    }

    getbrands() {
        this.apiService.getBrands().subscribe((res) => {
            this.brands = res;
            this.brands = this.brands.filter((val) => {
                if (val.value !== 'potterybarn') {
                    return val;
                }
            });
            this.featuredBrands = this.brands.filter(_ => _.feature === 1);
        });
    }

    toLink(link) {
        this.router.navigateByUrl(`products/brand?undefined=true&limit=24&filters=brand:${link};&sort_type=&pageno=1`);
    }
}
