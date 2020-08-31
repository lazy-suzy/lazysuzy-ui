import { tap, take } from "rxjs/operators";
import { ApiService } from "./../../../shared/services/api/api.service";
import { Component, OnInit } from "@angular/core";
import { IFilterData } from "src/app/shared/models";
import { HttpService } from "src/app/shared/services/http/http.service";
import { environment as env } from "src/environments/environment";

@Component({
  selector: "app-new-product-listing",
  templateUrl: "./new-product-listing.component.html",
  styleUrls: ["./new-product-listing.component.less"],
})
export class NewProductListingComponent implements OnInit {
  isLoading = true;
  isProductFetching = false;
  products: any = {};
  colors: any = [];
  materials: any = [];
  spinner = "assets/image/spinner.gif";
  page = 1;

  //For Infinite Scroll
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct(page: number = 1): void {
    this.isProductFetching = true;
    this.httpService
      .get(`${env.ADMIN_API_BASE_HREF}/staging-products?page=${page}`)
      .pipe(
        take(1) // take only one result and then unsubscribe
      )
      .subscribe(({ status, data }) => {
        if (status = 'success') {
          let receivedProducts = [];
          let receivedData = { ...data };
          if (this.products.data) {
            receivedProducts = [...this.products.data, ...data.data];
            receivedData.data = receivedProducts;
          }
          this.products = { ...receivedData };
          this.products.data.map((product) => {
            if (typeof product.color === "string") {
              product.color = product.color.split(",");
              //  product.shape = product.shape.split(",")
              product.colors = product.color.filter(this.removeNullItems);
              //  product.shapes = product.shape.filter(this.removeNullItems);
            }
            return product;
          });
          this.isProductFetching = false;
          this.isLoading = false;
        }
      });
  }
  onScrollDown(): void {
    const page: number = this.products.current_page + 1;
    this.loadProduct(page);
  }

  removeNullItems(elm)
  {
    return elm;
  }
  submit(): void {
    const submitProducts = this.products.data.filter((product) => {
      if (product.status === "accepted" || product.status === "rejected") {
        return true;
      }
      return false;
    });
    const formData = { products: submitProducts };
    this.httpService
      .post(
        `${env.ADMIN_API_BASE_HREF}/staging-products/update-multiple`,
        formData
      )
      .pipe(
        tap(() => (this.isProductFetching = true)),
        take(1)
      )
      .subscribe(({ status }) => {
        if (status=='success') {
          this.loadProduct();
        }
      });
  }
}
