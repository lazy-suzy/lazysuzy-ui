import {take} from 'rxjs/operators';
import {ApiService} from './../../../shared/services/api/api.service';
import {Component, OnInit} from '@angular/core';
import {HttpService} from 'src/app/shared/services/http/http.service';
import {environment as env} from 'src/environments/environment';

@Component({
    selector: 'app-new-product-listing',
    templateUrl: './new-product-listing.component.html',
    styleUrls: ['./new-product-listing.component.less'],
})
export class NewProductListingComponent implements OnInit {
    isLoading = true;
    isProductFetching = false;
    products: any = {};
    colors: any = [];
    materials: any = [];
    spinner = 'assets/image/spinner.gif';
    page = 1;
    filters: any;
    mapping_core: any;
    //For Infinite Scroll
    throttle = 300;
    scrollDistance = 1;
    scrollUpDistance = 2;
    selectedBrand = 'all';
    brands: any;

    constructor(private httpService: HttpService,
                private apiService: ApiService
    ) {
    }

    ngOnInit() {
        this.loadProduct();
        this.loadBrands();
    }

    loadBrands() {
        this.apiService.getBrands().subscribe((value: any) => {
            this.brands = value;
        });
    }

    brandChanged() {
        this.products.data = [];
        this.loadProduct();
    }

    loadProduct(page: number = 1): void {
        this.isProductFetching = true;
        let url = `${env.ADMIN_API_BASE_HREF}new-products?page=${page}&brand=${this.selectedBrand}`;
        this.httpService
            .get(url)
            .pipe(
                take(1) // take only one result and then unsubscribe
            )
            .subscribe(({status, data, extra}) => {
                if ((status = 'success')) {
                    let receivedProducts = [];
                    if (!this.filters) {
                        this.filters = extra.filters;
                    }
                    if (!this.mapping_core) {
                        this.mapping_core = extra.mapping_core;
                    }
                    let receivedData = {...data};
                    if (this.products.data) {
                        receivedProducts = [...this.products.data, ...data.data];
                        receivedData.data = receivedProducts;
                    }
                    this.products = {...receivedData};
                    this.products.data.map(this.mapProductFilterValues);
                    this.isProductFetching = false;
                    this.isLoading = false;
                }
            });
    }

    onScrollDown(): void {
        const page: number = this.products.current_page + 1;
        this.loadProduct(page);
    }

    //convert values seperated by commas to arrays.
    mapProductFilterValues(product) {
        if (typeof product.color === 'string') {
            product.color = product.color.split(',').filter((elm) => elm);
        }
        if (typeof product.seating === 'string') {
            product.seating = product.seating.split(',').filter((elm) => elm);
        }
        if (typeof product.shape === 'string') {
            product.shape = product.shape.split(',').filter((elm) => elm);
        }
        if (typeof product.material === 'string') {
            product.material = product.material.split(',').filter((elm) => elm);
        }
        if (typeof product.fabric === 'string') {
            product.fabric = product.fabric.split(',').filter((elm) => elm);
        }
        if (typeof product.ls_id === 'string') {
            product.ls_id = product.ls_id.split(',').filter((elm) => elm).map(elm => +elm);
        }
        return product;
    }

    submit(): void {
        const submitProducts = this.products.data.filter((product) => {
            if (product.status === 'approved' || product.status === 'rejected') {
                return true;
            }
            return false;
        });
        this.isProductFetching = true;
        const formData = {products: submitProducts};
        this.httpService
            .post(`${env.ADMIN_API_BASE_HREF}new-products/update-multiple`, formData)
            .pipe(
                take(1)
            )
            .subscribe(({status}) => {
                if (status === 'success') {
                    this.products = [];
                    this.loadProduct();
                }
            }, (error) => {
                this.isProductFetching = false;
            });
    }

    updateProduct(product) {
        this.products.data = {...this.products.data, product};
        this.products.data.map(this.mapProductFilterValues);
        console.log(this.products.data);
    }
}
