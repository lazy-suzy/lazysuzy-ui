import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../shared/services';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {
    logopath = 'assets/image/color_logo_transparent.png';
    departments = [];

    constructor(
        private apiService: ApiService
    ) {
    }

    ngOnInit() {
        this.loadDepartments();
    }

    loadDepartments() {
        this.apiService.browseRoom().subscribe((res: any) => {
            this.departments = res.all_departments;
            this.departments = this.departments.filter((val) => {
                if (val.department !== 'Bathroom' && val.department !== '') {
                    return val;
                }
            });
        });
    }
}
