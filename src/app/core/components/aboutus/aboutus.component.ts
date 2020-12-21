import {Component, Input, OnInit} from '@angular/core';
import {UtilsService} from '../../../shared/services';

@Component({
    selector: 'app-aboutus',
    templateUrl: './aboutus.component.html',
    styleUrls: ['./aboutus.component.less']
})
export class AboutusComponent implements OnInit {
    logoPath = 'assets/image/color_logo_transparent.png';
    isHandset = false;

    constructor(private utils: UtilsService) {
    }

    ngOnInit() {
        this.utils.isHandset().subscribe(handset => {
            this.isHandset = handset.matches;
        });
    }
}
