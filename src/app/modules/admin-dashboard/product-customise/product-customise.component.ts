import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../admin-dashboard.service';

@Component({
  selector: 'app-product-customise',
  templateUrl: './product-customise.component.html',
  styleUrls: ['./product-customise.component.scss']
})
export class ProductCustomiseComponent implements OnInit {

  positions = [
    { value: '0', viewValue: '0' },
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' }

  ];

  products = [
    { value: 'B1', viewValue: 'B1', images: [{}, {}, {}, {}] },
    { value: 'B2', viewValue: 'B2', images: [{}, {}, {}, {}] },
    { value: 'B1', viewValue: 'B1', images: [{}, {}, {}, {}] },
    { value: 'B2', viewValue: 'B2', images: [{}, {}, {}, {}] },
    { value: 'B1', viewValue: 'B1', images: [{}, {}, {}, {}] },
    { value: 'B2', viewValue: 'B2', images: [{}, {}, {}, {}] }
  ];

  allBoards = [
    { value: 'B1', viewValue: 'B1' },
    { value: 'B2', viewValue: 'B2' },
    { value: 'B3', viewValue: 'B3' },
    { value: 'B4', viewValue: 'B4' }
  ];

  selectedCategory = null;

  remoteProducts = [];

  filterData = {
    "brand": [
      {
        "name": "CB2",
        "value": "cb2",
        "enabled": false,
        "checked": false,
        "count": 0
      },
      {
        "name": "Crate&Barrel",
        "value": "cab",
        "enabled": false,
        "checked": false,
        "count": 0
      },
      {
        "name": "Pier1",
        "value": "pier1",
        "enabled": false,
        "checked": false,
        "count": 0
      },
      {
        "name": "West Elm",
        "value": "westelm",
        "enabled": true,
        "checked": false,
        "count": 103
      },
      {
        "name": "World Market",
        "value": "nw",
        "enabled": true,
        "checked": false,
        "count": 7
      }
    ],
    "type": [],
    "color": [
      {
        "name": "Black",
        "value": "black",
        "hex": "#000000",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Blue",
        "value": "blue",
        "hex": "#0000ee",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Brown",
        "value": "brown",
        "hex": "#a52a2a",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Clear",
        "value": "clear",
        "hex": "#dcf0ef",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Copper",
        "value": "copper",
        "hex": "#b87333",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Gold",
        "value": "gold",
        "hex": "#FFD700",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Green",
        "value": "green",
        "hex": "#008000",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Grey",
        "value": "grey",
        "hex": "#808080",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Multicolor",
        "value": "multicolor",
        "hex": "#eeeeee",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Pink",
        "value": "pink",
        "hex": "#FFC0CB",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Purple",
        "value": "purple",
        "hex": "#800080",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Red",
        "value": "red",
        "hex": "#FF0000",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Silver",
        "value": "silver",
        "hex": "#C0C0C0",
        "enabled": true,
        "checked": false
      },
      {
        "name": "Tan",
        "value": "tan",
        "hex": "#d2b48c",
        "enabled": true,
        "checked": false
      },
      {
        "name": "White",
        "value": "white",
        "hex": "#ffffff",
        "enabled": true,
        "checked": false
      }
    ],
    "category": [
      {
        "name": "Mirrors",
        "value": 1110,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Rugs",
        "value": 1130,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Sofas",
        "value": 201,
        "checked": true,
        "enabled": true
      },
      {
        "name": "Sectionals",
        "value": 202,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Loveseats",
        "value": 206,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Outdoor Sectionals",
        "value": 803,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Accent Chairs",
        "value": 210,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Ottomans",
        "value": 217,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Benches",
        "value": 216,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Bedroom Benches",
        "value": 317,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Hallway Seating",
        "value": 401,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Office Bookcases",
        "value": 604,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Dining Benches",
        "value": 503,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Dining Chairs",
        "value": 504,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Outdoor Benches",
        "value": 815,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Papasans",
        "value": 220,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Coffee & Side Tables",
        "value": 223,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Hallway Tables",
        "value": 402,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Bookcases",
        "value": 227,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Bar Carts + Storage",
        "value": 501,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Nightstands",
        "value": 315,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Hallway Storage",
        "value": 403,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Office Storage",
        "value": 605,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Buffets & Cabinets",
        "value": 510,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Dining Stools",
        "value": 505,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Dining Tables",
        "value": 507,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Beds",
        "value": 301,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Headboards",
        "value": 308,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Mattresses",
        "value": 309,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Dressers & Wardrobes",
        "value": 310,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Vanity",
        "value": 323,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Office Chairs",
        "value": 601,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Dining Sets",
        "value": 515,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Desks & Tables",
        "value": 602,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Shelving",
        "value": 704,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Laundry",
        "value": 701,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Bath Cabinets",
        "value": 703,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Outdoor Ottomans",
        "value": 801,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Outdoor Sofas",
        "value": 802,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Outdoor Tables",
        "value": 822,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Outdoor Chairs",
        "value": 808,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Outdoor Cushions",
        "value": 819,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Outdoor Sets",
        "value": 827,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Papasans",
        "value": 817,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Kids Beds",
        "value": 910,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Kids Chairs",
        "value": 920,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Kids Tables",
        "value": 930,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Kids Storage",
        "value": 940,
        "checked": false,
        "enabled": true
      },
      {
        "name": "Sleeper & Daybeds",
        "value": 207,
        "checked": false,
        "enabled": false
      },
      {
        "name": "Ottomans",
        "value": 324,
        "checked": false,
        "enabled": false
      },
      {
        "name": "Outdoor Accessories",
        "value": 828,
        "checked": false,
        "enabled": false
      },
      {
        "name": "Lighting",
        "value": 1120,
        "checked": false,
        "enabled": false
      }
    ],
    "seating": [
      {
        "name": "2 seats",
        "value": "2 seats",
        "count": 0,
        "enabled": false,
        "checked": false
      },
      {
        "name": "4 seats",
        "value": "4 seats",
        "count": 0,
        "enabled": false,
        "checked": false
      },
      {
        "name": "6 seats",
        "value": "6 seats",
        "count": 0,
        "enabled": false,
        "checked": false
      },
      {
        "name": "8 seats",
        "value": "8 seats",
        "count": 0,
        "enabled": false,
        "checked": false
      }
    ],
    "shape": []
  };
  showLoader = false;

  appliedFilters: string;
  pageNo = 0;

  constructor(private adminDashboardService: AdminDashboardService) { }

  ngOnInit() {
    this.adminDashboardService.getProducts("category", {}, "").subscribe(s => {
      this.products = s.products;
    });
  }

  // getBrowseData(categ) {
  //   this.showLoader = true;
  //   this.adminDashboardService
  //     .getBrowseTabData(this.selectedCategory, this.appliedFilters, this.pageNo)
  //     .subscribe((s: any) => {
  //       this.remoteProducts = [...this.remoteProducts, ...(s.products || [])];
  //       this.remoteProducts = this.remoteProducts.map((ele, i) => {
  //         return {
  //           ...ele,
  //           refId: i,
  //         };
  //       });
  //       this.filterData = s.filterData || {};
  //       this.showLoader = false;
  //     });
  // }

  someMethod(value) {
    console.log(value);
  }

  handleUpdates(event) {
    console.log(event);
  }

  onScroll() {

  }

}
