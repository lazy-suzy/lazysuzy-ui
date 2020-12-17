import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject, Observable} from 'rxjs';
import {environment as env} from 'src/environments/environment';
import {HttpService} from 'src/app/shared/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class AdminDashboardService {
    private adminDashboardState: BehaviorSubject<any> = new BehaviorSubject({});
    unsubscribe$: Subject<boolean> = new Subject();

    constructor(public httpService: HttpService) {
    }

    getProducts(
        total: number,
        filters = '',
        sortType = '',
        page: number
    ): Observable<any> {
        const endpoint = `products/all`;
        // tslint:disable-next-line: max-line-length
        const url = `${env.ADMIN_API_BASE_HREF}${endpoint}?limit=${total}&filters=${filters}&sort_type=${sortType}&pageno=${page}&board-view=true&admin=true`;
        return this.httpService.get(url);
    }

    tagImage(data): Observable<any> {
        const endpoint = `mark/image`;
        const url = `${env.ADMIN_API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data);
    }

    onDestroy() {
        this.unsubscribe$.next(true);
        this.unsubscribe$.complete();
    }

    cropImage(image, imageType, product): Observable<any> {
        const endPoint = `new-products/remove-background`;
        const url = `${env.ADMIN_API_BASE_HREF}${endPoint}`;
        const data = {
            image,
            image_type: imageType,
            product_sku: product.product_sku
        };
        return this.httpService.post(url, data);
    }
}
