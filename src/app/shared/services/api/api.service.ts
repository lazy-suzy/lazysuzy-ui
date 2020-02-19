import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { HttpService } from '../http/http.service';
import { IProductsPayload, IProductPayload } from './../../models';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpService: HttpService) {}

  getProducts(
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

  getProduct(id: string): Observable<IProductPayload> {
    const url = env.useLocalJson
      ? `${env.JSON_BASE_HREF}product/${id}`
      : `${env.API_BASE_HREF}product/${id}`;
    return this.httpService.get(url);
  }
}
