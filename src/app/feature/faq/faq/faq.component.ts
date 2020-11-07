import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../shared/services';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.less']
})
export class FaqComponent implements OnInit {

    questions = [
        {
            rank: 1,
            text: 'How does your order process work?'
        },
        {
            rank: 2,
            text: 'How are products ordered on our site and shipped to you?'
        },
        {
            rank: 3,
            text: 'How are we able to offer products at prices lower than the seller\'s own listed price?'
        },
        {
            rank: 4,
            text: 'What is our shipping policy?'
        },
        {
            rank: 5,
            text: 'What happens if an item you order is out of stock or facing delayed delivery times?'
        },
        {
            rank: 6,
            text: 'Can items ordered from multiple sellers be delivered on the same day?'
        },
        {
            rank: 7,
            text: 'Can you place orders to International locations outside of the United States?'
        },
        {
            rank: 8,
            text: 'How are returns handled?'
        },
    ];
    $bpObserverService;
    isHandset = false;

    constructor(
        private utils: UtilsService
    ) {
    }

    ngOnInit() {
        this.$bpObserverService = this.utils.isHandset().subscribe(value => {
            this.isHandset = value.matches;
        });
    }

    scrollToView(id) {
        document.getElementById(id).scrollIntoView();
    }
}
