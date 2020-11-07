import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../shared/services';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.less']
})
export class FaqComponent implements OnInit {

    questions = [
        'How does your order process work?',
        'How are products ordered on our site and shipped to you?',
        'How are we able to offer products at prices lower than the seller\'s own listed price?',
        'Can you place orders to International locations outside of the United States?',
        'What is our shipping policy?',
        'What happens if an item you order is out of stock or facing delayed delivery times?',
        'Can items ordered from multiple sellers be delivered on the same day?',
        'How are returns handled?'
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
