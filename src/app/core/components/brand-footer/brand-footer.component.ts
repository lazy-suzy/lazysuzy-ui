import {Component, Input, OnInit} from '@angular/core';
import {ApiService, EventEmitterService} from '../../../shared/services';
import {
    trigger,
    transition,
    useAnimation,
    style,
    animate, state
} from '@angular/animations';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-brand-footer',
    templateUrl: './brand-footer.component.html',
    styleUrls: ['./brand-footer.component.less'],

    animations: [
        trigger('fadeInUp', [
            state('not-visible', style({
                transform: 'translateY(20%)', opacity: 0
            })),
            state('visible', style({
                transform: 'translateY(0)',
                opacity: 1
            })),
            transition('not-visible => visible', [
                animate('500ms ease-in')
            ])
        ])
    ]
})
export class BrandFooterComponent implements OnInit {
    fade = true;
    eventSubscription: Subscription;
    featuredBrands = [];
    @Input() isHandset = false;

    constructor(
        private apiService: ApiService,
        private eventEmitterService: EventEmitterService
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
            this.fade = false;
        });
    }
}
