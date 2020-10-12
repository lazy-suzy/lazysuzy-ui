import {Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";
import {CookieService} from "ngx-cookie-service";
import {environment as env} from "../../../../environments/environment";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PromoCodeService {
    // http://staging.lazysuzy.com:8081/api/cart?state_code=AR&promo=LZ_FREEDOM
    baseUrl = `${env.API_BASE_HREF}cart`;

    constructor(
        private http: HttpService,
        private cookie: CookieService
    ) {
    }

    getPromoCodeProducts(urlParams) {

        const url = `${this.baseUrl}?${urlParams}`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.cookie.get('token')}`
        });
        return this.http.get(url,headers)
    }

}
