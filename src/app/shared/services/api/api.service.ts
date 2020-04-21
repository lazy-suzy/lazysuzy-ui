import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment as env } from 'src/environments/environment';
import { HttpService } from '../http/http.service';
import { UtilsService } from '../utils/utils.service';
import {
  IProductsPayload,
  IProductPayload,
  ISearchProductsPayload,
  IDepartment
} from './../../models';
import { MOCK_PRODUCT_FILTERS } from 'src/app/mocks';
import { forkJoin } from 'rxjs'; // RxJS 6 syntax

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private httpService: HttpService,
    private cookie: CookieService,
    private utils: UtilsService
  ) {}

  getNewArrivals(filters = '', page = 0): Observable<IProductsPayload> {
    const endpoint = `products/all`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}?new=true`;
    return this.httpService.get(url);
  }

  getTopDeals(filters = '', page = 0): Observable<IProductsPayload> {
    const endpoint = `products/all`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}?sale=true`;
    return this.httpService.get(url);
  }

  getBestSellers(filters = '', page = 0): Observable<IProductsPayload> {
    const endpoint = `products/all`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}?bestseller=true`;
    return this.httpService.get(url);
  }

  getEmail(email = '', url = '') {
    const endpoint = 'subscribe';
    const path = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}?email=${email}&url=${url}`;
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
      : `${env.API_BASE_HREF}${endpoint}?home=true`;
    return this.httpService.get(url);
  }

  bannerData() {
    const endpoint = 'banners';
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}`;
    return this.httpService.get(url);
  }

  getAllProducts(
    trend: string,
    total: number,
    filters = '',
    sortType = '',
    page = 0
  ): Observable<IProductsPayload> {
    const endpoint = `products/all`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}?${trend}=true&limit=${total}&filters=${filters}&sort_type=${sortType}&pageno=${page}`;
    return this.httpService.get(url);
  }

  getMultiplePageAllProducts(
    trend: string,
    total: number,
    filters = '',
    sortType = '',
    page: number
  ): Observable<any> {
    const httpCalls = [];
    const endpoint = `products/all`;
    for (let i = 0; i <= page; i++) {
      const url = env.useLocalJson
        ? `${env.JSON_BASE_HREF}${endpoint}`
        : `${env.API_BASE_HREF}${endpoint}?${trend}=true&limit=${total}&filters=${filters}&sort_type=${sortType}&pageno=${i}`;
      httpCalls.push(this.httpService.get(url));
    }
    return forkJoin(httpCalls);
  }

  getProducts(
    department: string,
    category: string,
    filters = '',
    sortType = '',
    page = 0
  ): Observable<IProductsPayload> {
    const endpoint = `products/${department}/${category}`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}?filters=${filters}&sort_type=${sortType}&pageno=${page}`;
    return this.httpService.get(url);
  }

  getMultiplePageProducts(
    department: string,
    category: string,
    filters = '',
    sortType = '',
    page: number
  ): Observable<any> {
    const httpCalls = [];
    const endpoint = `products/${department}/${category}`;
    for (let i = 0; i <= page; i++) {
      const url = env.useLocalJson
        ? `${env.JSON_BASE_HREF}${endpoint}`
        : `${env.API_BASE_HREF}${endpoint}?filters=${filters}&sort_type=${sortType}&pageno=${i}`;
      httpCalls.push(this.httpService.get(url));
    }
    return forkJoin(httpCalls);
  }

  getProduct(id: string): Observable<IProductPayload> {
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}product/${id}`
      : `${env.API_BASE_HREF}product/${id}`;
    return this.httpService.get(url);
  }

  getAllDepartments(): Observable<IDepartment> {
    const endpoint = `all-departments`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}`;
    return this.httpService.get(url);
  }

  getSearchProducts(search_query: string): Observable<ISearchProductsPayload> {
    const endpoint = `products/_search`;
    const url = `${env.ES_API_BASE_HREF}${endpoint}?source=${search_query}&source_content_type=application%2Fjson`;
    return this.httpService.get(url);
  }

  getWishlistProducts(): Observable<IProductsPayload> {
    // const filters = '';
    // const sortTypes = '';
    // const endpoint = `products/${department}/${category}`;
    const endpoint = `wishlist`;
    const url = `${env.API_BASE_HREF}${endpoint}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.cookie.get('token')}`
    });
    // env.useLocalJson
    //   ? `${env.JSON_BASE_HREF}${endpoint}`
    //   : `${env.API_BASE_HREF}${endpoint}?filters=${filters}&sort_type=${sortTypes}&pageno=${page}`;
    return this.httpService.get(url, headers);
  }

  getCategories(department: string): Observable<ISearchProductsPayload> {
    const endpoint = `categories/${department}`;
    const url = `${env.API_BASE_HREF}${endpoint}`;
    return this.httpService.get(url);
  }

  login(data) {
    const endpoint = `login`;
    const url = `${env.API_BASE_HREF}${endpoint}`;
    return this.httpService.post(url, data);
  }

  subscription(URL, email): Observable<string> {
    const endpoint = `subscribe`;
    const url = `${env.API_BASE_HREF}${endpoint}?url=${URL}&email=${email}`;
    return this.httpService.get(url);
  }

  wishlistProduct(sku, mark) {
    let endpoint;
    if (mark) {
      endpoint = `mark/favourite/${sku}`;
    } else {
      endpoint = `unmark/favourite/${sku}`;
    }
    const token = this.cookie.get('token');
    if (!token) {
      // trigger signup window
      this.utils.openSignupDialog();
      return;
    }
    const url = `${env.API_BASE_HREF}${endpoint}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.httpService.get(url, headers);
  }

  signup(data) {
    const endpoint = `register`;
    const url = `${env.API_BASE_HREF}${endpoint}`;
    return this.httpService.post(url, data);
  }

  getAuthToken(access_token, provider) {
    const endpoint = `oauth/token`;
    const url = `${env.API_BASE_HREF}${endpoint}`;
    const data = {
      access_token,
      client_id: 11,
      client_secret: 'qVBaGC2G2qxa55VlbFRMrnPrjJGcRB98HFo8YoE4',
      grant_type: 'social',
      provider
    };
    return this.httpService.post(url, data);
  }
}
