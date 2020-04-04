import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  data = {
    useCache: false,
    productSku: ''
  }

  constructor() { }

}
