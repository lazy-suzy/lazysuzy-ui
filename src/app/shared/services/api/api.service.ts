import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { HttpService } from '../http/http.service';
import {
  IProductsPayload,
  IProductPayload,
  ISearchProductsPayload
} from './../../models';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpService: HttpService) {}

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
    console.log(url);

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
