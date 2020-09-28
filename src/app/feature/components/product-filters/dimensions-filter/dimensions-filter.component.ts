import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-dimensions-filter',
    templateUrl: './dimensions-filter.component.html',
    styleUrls: ['./dimensions-filter.component.less']
})
export class DimensionsFilterComponent implements OnInit {

    @Input() dimensions = {};

    height = {};
    width = {};
    length = {};
    depth = {};
    diameter = {};
    square = {};

    constructor() {
    }

    ngOnInit() {

    }

}
