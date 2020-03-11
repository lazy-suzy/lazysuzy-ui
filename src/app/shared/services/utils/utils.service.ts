import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  checkDataLength(data) {
    return data.length > 0;
  }

}
