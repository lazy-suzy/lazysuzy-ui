import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-new-product-row",
  templateUrl: "./new-product-row.component.html",
  styleUrls: ["./new-product-row.component.less"],
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
  constructor() {}

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
    this.product.ls_id.forEach((ls_id) => {
      const value = this.mapping_core.filter((mapper) => mapper.LS_ID == ls_id);
      if (value.length) {
        const category_detail_string = `${value[0].dept_name_short} > ${value[0].cat_name_short} > ${value[0].cat_sub_name}`;
        this.category_detail.push(category_detail_string);
      }
    });
  }
}
