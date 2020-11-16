import {Component, Input, OnInit} from '@angular/core';
import {AdminDashboardService} from '../../admin-dashboard/admin-dashboard.service';

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

    allFilters = {};
    filterKeys = [];
    color_filter = [];
    material_filter = [];
    seating_filter = [];
    shape_filter = [];
    fabric_filter = [];
    country_filter = [];
    category_detail = [];

    xImagePrimary = [];
    xImageSecondary = [];

    constructor(
        private adminDashboardService: AdminDashboardService
    ) {
    }

    ngOnInit() {
        this.setFilters(this.filters);
        this.setCategoryDetail();
    }

    setFilters(filter: any) {
        this.color_filter = filter.Color;
        this.material_filter = filter.Color;
        this.material_filter = filter.Material;
        this.shape_filter = filter.Shape;
        this.seating_filter = filter.Seating;
        this.fabric_filter = filter.Fabric;
        this.country_filter = filter.Country;
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

    updateImage(index: number, image: string, $event) {
        const imageItem: ImageItem = {
            index,
            image
        };
        if ($event.value === 'primary') {
            this.checkSecondaryImage(imageItem);
            this.xImagePrimary.push(imageItem);
        } else {
            this.checkPrimaryImage(imageItem);
            this.xImageSecondary.push(imageItem);
        }
        this.product.image_xbg_select_primary = this.xImagePrimary.map(this.imageOnly).join(',');
        this.product.image_xbg_select_secondary = this.xImageSecondary.map(this.imageOnly).join(',');
    }

    imageOnly(imageItem: ImageItem) {
        return imageItem.image;
    }

    checkPrimaryImage(imageItem) {
        const itemIndex = this.xImagePrimary.findIndex((value: ImageItem) => value.index === imageItem.index);
        if (itemIndex !== -1) {
            this.xImagePrimary.splice(itemIndex, 1);
        }
    }

    checkSecondaryImage(imageItem) {
        const itemIndex = this.xImageSecondary.findIndex((value: ImageItem) => value.index === imageItem.index);
        if (itemIndex !== -1) {
            this.xImageSecondary.splice(itemIndex, 1);
        }
    }

    private updatePrimaryXImage(index, image) {
        const imageItem = {
            index,
            image
        };
        this.xImageSecondary.push(imageItem);
    }
}
