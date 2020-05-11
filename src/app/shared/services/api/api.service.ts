import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment as env } from 'src/environments/environment';
import { HttpService } from '../http/http.service';
import { UtilsService } from '../utils/utils.service';
import {
  IProductsPayload,
  IProductPayload,
  ISearchProductsPayload,
  IDepartment,
  IProductDetail
} from './../../models';
import { MOCK_PRODUCT_FILTERS } from 'src/app/mocks';
import { forkJoin } from 'rxjs'; // RxJS 6 syntax
import { delay, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private httpService: HttpService,
    private cookie: CookieService,
    private utils: UtilsService
  ) { }

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

  getProduct(id: string): Observable<IProductDetail> {
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

  getCustomProducts(): Observable<any> {
    // TODO: To be done.
    const result = [
      {
        asset_id: 7,
        user_id: 1,
        name: '',
        price: '',
        brand: null,
        path: 'uploads/0BA81717-B481-EA94-84E9-2E3C9268FF2B.jpeg',
        transparent_path: 'uploads/1720DB7C-72D3-681E-A149-30B8B608BBD7.png',
        is_private: 0,
        created_at: '2020-03-31 05:33:42',
        modified_at: '2020-03-31 13:03:56',
        is_active: 1
      },
      {
        asset_id: 6,
        user_id: 1,
        name: 'bed',
        price: '',
        brand: null,
        path: 'uploads/0C5B07AF-65A5-8098-9838-25C4AA291F3C.jpeg',
        transparent_path: 'uploads/3B16C0A4-4904-B9C9-D9C4-253AEDDD0AF2.png',
        is_private: 0,
        created_at: '2020-03-27 20:59:12',
        modified_at: '2020-03-27 20:59:24',
        is_active: 1
      },
      {
        asset_id: 5,
        user_id: 1,
        name: 'custom',
        price: null,
        brand: 'custom',
        path: 'uploads/2F20D5D7-9069-88DF-E0E1-CA7352F16FE7.png',
        transparent_path: 'uploads/359FD8C8-35CF-F18E-1AED-50C148F9D678.png',
        is_private: 1,
        created_at: '2020-03-27 20:58:29',
        modified_at: '2020-03-27 20:58:33',
        is_active: 1
      },
      {
        asset_id: 4,
        user_id: 1,
        name: 'custom',
        price: null,
        brand: 'custom',
        path: 'uploads/97A9EBCD-D0B2-2AA5-3A07-2DB6D7AA933F.gif',
        transparent_path: 'uploads/B8235047-021D-FDAB-43B1-0093B244AF07.png',
        is_private: 1,
        created_at: '2020-03-27 20:58:02',
        modified_at: '2020-03-27 20:58:10',
        is_active: 1
      },
      {
        asset_id: 2,
        user_id: 1,
        name: 'High Back Chair',
        price: '450',
        brand: null,
        path: 'uploads/3A0FD864-69DC-2FEB-9B80-B417CF2FCC0A.png',
        transparent_path: 'uploads/9143AED4-A686-7D90-196B-F909348067E4.png',
        is_private: 1,
        created_at: '2020-03-24 00:02:30',
        modified_at: '2020-03-27 20:57:47',
        is_active: 1
      },
      {
        asset_id: 3,
        user_id: 1,
        name: '',
        price: '',
        brand: null,
        path: 'uploads/03A566DD-88BC-3143-23B4-18517CAD1D93.jpeg',
        transparent_path: 'uploads/B2F1A3FA-C58D-B463-A2A7-AB51AD75F248.png',
        is_private: 0,
        created_at: '2020-03-26 05:32:43',
        modified_at: '2020-03-26 05:32:52',
        is_active: 1
      },
      {
        asset_id: 1,
        user_id: 1,
        name: 'custom',
        price: null,
        brand: 'custom',
        path: 'uploads/F20B8FA2-D805-8F42-DC80-01EB05D3C0BB.png',
        transparent_path: null,
        is_private: 1,
        created_at: '2020-03-23 23:48:08',
        modified_at: '2020-03-23 23:48:08',
        is_active: 1
      }
    ];
    return of(result).pipe(delay(1000));
  }

  getBrowseTabData(id: string, appliedFilters, pageNo): Observable<any> {
    const endpoint = `products/all?filters=category:${id}&sort_type=&pageno=${pageNo || 0}&limit=24&board-view=true`;
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

  wishlistProduct(sku, mark, isHandset: boolean) {
    let endpoint;
    if (mark) {
      endpoint = `mark/favourite/${sku}`;
    } else {
      endpoint = `unmark/favourite/${sku}`;
    }
    const token = this.cookie.get('token');
    if (!token) {
      // trigger signup window
      this.utils.openSignupDialog(isHandset, true);
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
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookie.get('token')}`
    });
    return this.httpService.post(url, data, headers);
  }

  getPosts(): Observable<any[]> {
    return this.httpService.get<any[]>(
      'https://psimonmyway.com/wp-json/wp/v2/posts?_embed',
      {
        params: {
          per_page: '6'
        }
      }
    );
  }

  getPostById(id): Observable<any[]> {
    return this.httpService.get<any[]>(
      `https://psimonmyway.com/wp-json/wp/v2/posts/${id}`
    );
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

  getAllDepartmentsBoard(): Observable<any> {
    const endpoint = `all-departments?board-view=true`;
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}${endpoint}`
      : `${env.API_BASE_HREF}${endpoint}`;
    return this.httpService.get(url);
  }

  getAllBoards(payload): Observable<IProductPayload> {
    const url = `${env.API_BASE_HREF}board`;
    return this.httpService.post(url, {
      operation: 'select',
      entity: 'board',
      data: 5,
      Buser_id: 1
    });
  }
}
