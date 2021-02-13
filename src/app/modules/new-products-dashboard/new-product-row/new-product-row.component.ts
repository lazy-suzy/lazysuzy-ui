import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AdminDashboardService} from '../../admin-dashboard/admin-dashboard.service';
import {DimensionGroupInterface, DimensionValueInterface} from '../dimension.interface';

interface ImageItem {
    index: number;
    image: string;
}

@Component({
    selector: 'app-new-product-row',
    templateUrl: './new-product-row.component.html',
    styleUrls: ['./new-product-row.component.less'],
})
export class NewProductRowComponent implements OnInit {
    @Input() product: any = {};
    @Input() index = 1;
    @Input() filters;
    @Input() mapping_core;

    @Output() updateProduct = new EventEmitter();
    allFilters = {};
    filterKeys = [];
    color_filter = [];
    material_filter = [];
    seating_filter = [];
    shape_filter = [];
    fabric_filter = [];
    country_filter = [];
    style_filter = [];
    firmness_filter = [];
    category_detail = [];
    productImages = [];
    xImagePrimary = [];
    xImageSecondary = [];

    constructor(
        private adminDashboardService: AdminDashboardService
    ) {
    }

    ngOnInit() {
        this.setFilters(this.filters);
        this.setCategoryDetail();
        this.loadAllProductImages();
        if (!this.product.is_handmade) {
            this.product.is_handmade = '0';
        }
    }

    loadAllProductImages() {
        this.product.main_product_images.split(',').forEach(value => {
            this.productImages.push(value);
        });
        this.product.product_images.split(',').forEach(value => {
            if (this.productImages.indexOf(value) === -1) {
                this.productImages.push(value);
            }
        });
    }

    setFilters(filter: any) {
        this.color_filter = filter.Color;
        this.material_filter = filter.Color;
        this.material_filter = filter.Material;
        this.shape_filter = filter.Shape;
        this.seating_filter = filter.Seating;
        this.fabric_filter = filter.Fabric;
        this.country_filter = filter.Country;
        this.style_filter = filter.Style;
        this.firmness_filter = filter.Firmness;
    }

    setCategoryDetail() {
        this.category_detail = [];
        //  console.log(Object.keys(this.mapping_core))
        if (this.product.ls_id) {
            this.product.ls_id.forEach((ls_id) => {
                const value = this.mapping_core.filter((mapper) => mapper.LS_ID == ls_id);
                if (value.length) {
                    const category_detail_string = `${value[0].dept_name_short} > ${value[0].cat_name_short} > ${value[0].cat_sub_name}`;
                    this.category_detail.push(category_detail_string);
                }
            });
        }
    }

    isArray(value) {
        return Array.isArray(value);
    }

    tagImage(productSku, image, value) {
        const data = {
            product_sku: productSku,
            image,
            type: value
        };
        this.adminDashboardService.tagImage(data).subscribe((response) => {
            if (response.status) {
                if (value === 'primary') {
                    let images = [];
                    if (this.product.image_xbg_select_primary) {
                        images = this.product.image_xbg_select_primary.split(',');
                    }
                    images.push(response.image);
                    this.product.image_xbg_select_primary = images.join(',');
                }
                if (value === 'secondary') {
                    let images = [];
                    if (this.product.image_xbg_select_secondary) {
                        images = this.product.image_xbg_select_secondary.split(',');
                    }
                    images.push(response.image);
                    this.product.image_xbg_select_secondary = images.join(',');
                }
            }
        });
    }

    addDimension(index) {
        const newDimension: DimensionValueInterface = {
            name: '',
            value: {}
        };
        if (!this.product.product_dimension[index].groupValue) {
            this.product.product_dimension[index].groupValue = [];
        }
        this.product.product_dimension[index].groupValue.push(newDimension);
    }

    addDimensionGroup() {
        if (!this.product.product_dimension) {
            this.product.product_dimension = [];
        }
        const dimensionGroup: DimensionGroupInterface = {
            groupName: '',
            groupValue: [{
                name: '',
                value: {}
            }]
        };
        this.product.product_dimension.push(dimensionGroup);
    }

    copyDimension(index) {
        // DEEP COPY HACK
        const newDimension = JSON.parse(JSON.stringify(this.product.product_dimension[index]));
        this.product.product_dimension = [...this.product.product_dimension, newDimension];
    }

    isObject(value) {
        return typeof value === 'object';
    }

    cropImage(image, imageType) {
        this.adminDashboardService.cropImage(image, imageType, this.product).subscribe(
            (response: any) => {
                this.product[imageType] = response.product[imageType];
            }
        );
    }
}
