import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {IAllCategory} from '../../../shared/models/all-department.interface';
import {ApiService, SeoService} from './../../../shared/services';
import {ActivatedRoute, Router} from '@angular/router';
import MetaData from '../../../shared/services/seo/meta-data-model';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.less']
})
export class CategoriesComponent implements OnInit {
    routeSubscription: Subscription;
    categorySubscription: Subscription;
    department: string;
    categories: IAllCategory[];

    constructor(
        private apiService: ApiService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private seoService: SeoService
    ) {
    }

    ngOnInit(): void {
        this.getParams();
        this.routeSubscription = this.activeRoute.params.subscribe(
            (routeParams) => {
                this.department = routeParams.department;
                this.getCategories();
            }
        );
        this.getCategories();
    }

    onDestroy(): void {
        this.routeSubscription.unsubscribe();
        this.categorySubscription.unsubscribe();
    }

    getParams(): void {
        const urlParams: string[] = this.router.url.split('/').slice(1);
        this.department = urlParams[1];
    }

    getCategories() {
        this.categorySubscription = this.apiService
            .getCategories(this.department)
            .subscribe((payload: any) => {
                this.categories = payload.categories;
                this.setMetaTags(payload);
            });
    }

    setMetaTags(department) {
        const metaData: MetaData = {};
        metaData.title = `Search from hundreds of ${department.department_long} products of top brands at once.`;
        metaData.description = `Search from hundreds of ${department.department_long} products of top brands at once.Add to your room designs with your own design boards.`;
        metaData.image = department.department_image;
        this.seoService.setMetaTags(metaData);
    }
}
