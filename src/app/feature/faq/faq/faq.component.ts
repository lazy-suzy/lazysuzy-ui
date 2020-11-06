import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.less']
})
export class FaqComponent implements OnInit {

    questions = [
        'How does your order process work?',
        'Do you hold and ship products yourself or ship from sellers directly?',
        'How are you able to offer prices lower than the seller\'s own listed price?',
        'Do you accept returns?',
        'Do you offer free delivery?',
        'What happens if an item I order is out of stock or facing delayed delivery times?',
        'Can I have all items from multiple sellers delivered to me on the same day / same time?',
        'Can I place orders to International locations outside of the United States?',
    ];

    constructor() {
    }

    ngOnInit() {
    }

    scrollToView(id) {
        document.getElementById(id).scrollIntoView();
    }
}
