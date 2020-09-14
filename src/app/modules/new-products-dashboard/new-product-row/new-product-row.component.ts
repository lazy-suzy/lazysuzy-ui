import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: "app-new-product-row",
  templateUrl: "./new-product-row.component.html",
  styleUrls: ["./new-product-row.component.less"],
})
export class NewProductRowComponent implements OnInit {
  @Input() product: any = {};
  @Input() index = 1;
  @Input() filters;
  color_filter = [];
  material_filter = [];
  seating_filter = [];
  shape_filter = [];
  fabric_filter = [];

  constructor() {}

  ngOnInit() {
    this.setFilters(this.filters);
  }

  setFilters(filter: any) {
    this.color_filter = filter.Color;
    this.material_filter = filter.Material;
    this.shape_filter = filter.Shape;
    this.seating_filter = filter.Seating;
    this.fabric_filter = filter.Fabric;
  }
}
