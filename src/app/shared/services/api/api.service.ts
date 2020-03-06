import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { HttpService } from '../http/http.service';
import {
  IProductsPayload,
  IProductPayload,
  ISearchProductsPayload,
} from './../../models';
import { MOCK_PRODUCT_FILTERS } from 'src/app/mocks';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpService: HttpService) {}

  getNewArrivals(filters = '', page = 0):  Observable<IProductsPayload> {
    console.log("new arrival filter in srevice", filters);
    const endpoint = `products/all`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      // : `${env.ES_API_BASE_HREF}${endpoint}`;
      : `${env.ES_API_BASE_HREF}${endpoint}?filters=${filters}&pageno=${page}`;
    return this.httpService.get(url);
  } 

  getTopDeals(filters = '', page = 0):  Observable<IProductsPayload> {
    const endpoint = `products/all`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.ES_API_BASE_HREF}${endpoint}?filters=${filters}&pageno=${page}`;
    return this.httpService.get(url);
  }

  getBestSellers(filters = '', page = 0):  Observable<IProductsPayload> {
    const endpoint = `products/all`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.ES_API_BASE_HREF}${endpoint}?filters=${filters}&pageno=${page}`;
    return this.httpService.get(url);
  }

  getEmail(email = '', url = ''){
    const endpoint = 'subscribe';
    const path = env.useLocalJson
    ? `${env.JSON_BASE_HREF}${endpoint}`
    : `${env.ES_API_BASE_HREF}${endpoint}?email=${email}&url=${url}`;
    return this.httpService.get(path);
  }
  getBrands(): Observable<IProductPayload> {
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}brand`
      : `${env.API_BASE_HREF}brand`;
    return this.httpService.get(url);
  }

  browseRoom() {
    const endpoint = 'all-departments';
    const url = env.useLocalJson
    ? `${env.JSON_BASE_HREF}${endpoint}`
    : `${env.ES_API_BASE_HREF}${endpoint}?home=true`;
    return this.httpService.get(url);
  }

  bannerData(){
    const endpoint = "banners";
    const url = env.useLocalJson
    ? `${env.JSON_BASE_HREF}${endpoint}`
    : `${env.API_BASE_HREF}${endpoint}`
    return this.httpService.get(url);
  }

  seeAllArrivals(total){
    console.log("total", total);
    const endpoint = "products/all";
    const url = env.useLocalJson
    ? `${env.JSON_BASE_HREF}${endpoint}`
    : `${env.ES_API_BASE_HREF}${endpoint}?new=true&limit=${total}`;
    return this.httpService.get(url);
  }

  seeAllDeals(total){
    console.log("total", total);
    const endpoint = "products/all";
    const url = env.useLocalJson
    ? `${env.JSON_BASE_HREF}${endpoint}`
    : `${env.ES_API_BASE_HREF}${endpoint}?sale=true&limit=${total}`;
    return this.httpService.get(url);
  }

  getProducts(
    department: string,
    category: string,
    filters = '',
    page = 0
  ): Observable<IProductsPayload> {
    const sortTypes = '';
    const endpoint = `products/${department}/${category}`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}?filters=${filters}&sort_type=${sortTypes}&pageno=${page}`;
    return this.httpService.get(url);
  }

  getProduct(id: string): Observable<IProductPayload> {
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}product/${id}`
      : `${env.API_BASE_HREF}product/${id}`;
    return this.httpService.get(url);
  }

  getSearchProducts(search_query: string): Observable<ISearchProductsPayload> {
    const endpoint = `products/_search`;
    const url = `${env.ES_API_BASE_HREF}${endpoint}?source=${search_query}&source_content_type=application%2Fjson`;
    return this.httpService.get(url);
  }

  getWishlistProducts(
    department: string,
    category: string,
    page = 0
  ): Observable<IProductsPayload> {
    const filters = '';
    const sortTypes = '';
    const endpoint = `products/${department}/${category}`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}?filters=${filters}&sort_type=${sortTypes}&pageno=${page}`;
    return this.httpService.get(url);
  }
}
