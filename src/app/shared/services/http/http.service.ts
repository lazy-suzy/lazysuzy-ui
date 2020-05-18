import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  headers: HttpHeaders;

  constructor(private http: HttpClient, private cookie: CookieService,) {
    const token = this.cookie.get('token');
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // for getting local json data
  getJson<T>(location: string): Observable<T> {
    return this.http.get<T>(location);
  }

  get<T>(url: string, headers?): Observable<T> {
    const options = headers ? headers : this.headers ;
    return this.http.get<T>(url, { headers: options });
  }

  post<T>(url: string, payload: any, headers?): Observable<T> {
    const options = headers ? headers : { headers: this.headers };
    return this.http.post<T>(url, payload, { headers: options });
  }

  put<T>(url: string, payload: any, headers?): Observable<T> {
    const options = headers ? headers : { headers: this.headers };
    return this.http.put<T>(url, payload, { headers: options });
  }

  patch<T>(url: string, payload: any, headers?): Observable<T> {
    const options = headers ? headers : { headers: this.headers };
    return this.http.patch<T>(url, payload, { headers: options });
  }

  delete<T>(url: string, headers?): Observable<T> {
    const options = headers ? headers : { headers: this.headers };
    return this.http.delete<T>(url, { headers: options });
  }
}
