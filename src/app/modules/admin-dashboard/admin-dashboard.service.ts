import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { HttpService } from 'src/app/shared/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private adminDashboardState: BehaviorSubject<any> = new BehaviorSubject({});
  unsubscribe$: Subject<boolean> = new Subject();

  constructor(public httpService: HttpService) {}

  getProducts(
    total: number,
    filters = '',
    sortType = '',
    page: number
  ): Observable<any> {
    const endpoint = `products/all`;
    const url = `${env.ADMIN_API_BASE_HREF}${endpoint}?limit=${total}&filters=${filters}&sort_type=${sortType}&pageno=${page}&board-view=true`;
    return this.httpService.get(url);
  }
  tagImage(data): Observable<any> {
    const endpoint = `mark/image`;
    const url = `${env.ADMIN_API_BASE_HREF}${endpoint}`;
    return this.httpService.post(url, data);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
