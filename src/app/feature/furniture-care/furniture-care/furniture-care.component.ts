import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../shared/services';

@Component({
    selector: 'app-furniture-care',
    templateUrl: './furniture-care.component.html',
    styleUrls: ['./furniture-care.component.less']
})
export class FurnitureCareComponent implements OnInit {
    $bpObserverService: any;
    isHandset = false;

    constructor(private utils: UtilsService) {
    }

    ngOnInit() {
        this.$bpObserverService = this.utils.isHandset().subscribe(value => {
            this.isHandset = value.matches;
        });
    }
}
