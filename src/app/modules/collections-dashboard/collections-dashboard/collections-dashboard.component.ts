import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../../shared/services';
import {HttpService} from '../../../shared/services/http/http.service';
import {environment as env} from 'src/environments/environment';

@Component({
    selector: 'app-collections-dashboard',
    templateUrl: './collections-dashboard.component.html',
    styleUrls: ['./collections-dashboard.component.less']
})
export class CollectionsDashboardComponent implements OnInit {
    isLoading = true;
    spinner = 'assets/image/spinner.gif';
    collectionsForm: FormGroup;
    brands: any;
    collections: any;

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private httpService: HttpService
    ) {
        this.collectionsForm = fb.group({
            name: [''],
            isdisplay: [0],
            value: [''],
            brand: [''],
            desc_header: [''],
            desc_cover: [''],
            image_cover: [''],
            feature: fb.array(this.initializeFeaturesArray()),
        });
    }

    get features(): FormArray {
        return this.collectionsForm.get('feature') as FormArray;
    }

    initializeFeaturesArray(): any[] {
        const featureArray = [];
        for (let i = 0; i < 4; i++) {
            const array = this.fb.group({
                image: [],
                description: []
            });
            featureArray.push(array);
        }
        return featureArray;
    }

    ngOnInit() {
        this.getBrandsAndCollection();
    }

    addFeature() {
        const array = this.fb.group({
            image: [],
            description: []
        });
        const feature = this.collectionsForm.get('feature') as FormArray;
        feature.push(array);
    }

    getBrandsAndCollection() {
        this.apiService.getBrands().subscribe(response => {
            this.brands = response;
        });
        this.apiService.getCollectionsCount().subscribe(response => {
            this.collections = response;
            this.isLoading = false;
        });
    }

    setCollection(event) {
        this.collectionsForm.patchValue({
            value: event.value.collection,
        });
    }

    submit() {
        this.isLoading = true;
        // Remove Null Features before submitting
        this.collectionsForm.value.feature = this.collectionsForm.value.feature.filter(value => {
            return !!(value.image && value.description);
        });
        const url = `${env.ADMIN_API_BASE_HREF}save_collection`;
        this.httpService.post(url, this.collectionsForm.value).subscribe((response: any) => {
            if (response.status) {
                this.collectionsForm.reset();
                this.initializeFeaturesArray();
                this.isLoading = true;
            }
        }, (error => {
            this.isLoading = true;
        }));
    }
}
