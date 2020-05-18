import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from 'src/app/shared/services';

@Injectable({
    providedIn: 'root'
})
export class AdminDashboardService {

    private adminDashboardState: BehaviorSubject<any> = new BehaviorSubject({});
    unsubscribe$: Subject<boolean> = new Subject();

    constructor(public apiService: ApiService) { }

    ngOnDestroy() {
        this.unsubscribe$.next(true);
        this.unsubscribe$.complete();
    }

}
