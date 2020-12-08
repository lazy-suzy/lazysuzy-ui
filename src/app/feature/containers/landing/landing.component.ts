import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService, SeoService} from './../../../shared/services';
import {Observable, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {EventEmitterService} from 'src/app/shared/services';
import {ActivatedRoute, Router} from '@angular/router';
import {boardRoutesNames} from '../../../modules/board/board.routes.names';
import {BoardService} from '../../../modules/board/board.service';
import {Board} from '../../../modules/board/board';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {
    // departments: IDepartment[] = MOCK_DEPARTMENTS;

    newArrivals: any;
    newProducts: any;
    totalArrivals: any;
    topDeals: any;
    bestSellers: any;
    emailForm: FormGroup;
    bpObserver: Observable<BreakpointState> = this.breakpointObserver.observe(
        Breakpoints.Handset
    );

    bpSubscription: Subscription;
    isHandset = false;
    eventSubscription: Subscription;
    desktopAboutImage = 'https://www.lazysuzy.com/images/landing/WhoIsLZ_d.png';
    contentList = [
        'Design your space the way you want',
        'Mix and match various styles',
        'Easy drag & drop from our catalog',
        'Upload your own items',
        'Publish and share your work to inspire others'
    ];
    carousalOptions = {
        autoWidth: false,
        loop: true,
        items: 1,
        center: true,
        dots: false,
        nav: true,
        margin: 10,
        navText: ['', '<button class=\'right-icon\'><span class="fa fa-chevron-right right-arrow"></span></button>'],
        pagination: true,
        responsive: {
            0: {
                nav: false,
                items: 1,
            },
            1024: {
                items: 5,
                loop: false,
                center: false,
                margin: 10,
            },
        },
    };
    reviews = [
        {
            title: '10/10',
            writer: 'KB',
            review:
                'I greatly appreciate you, LazySuzy! Great customer service, and even though delivery times were delayed because of COVID-19, they kept me updated on the status of my order, and it was still delivered reasonably quickly. This is a great site, and I would order again.'
        },
        {
            title: 'Love my chair!',
            writer: 'Angela M.',
            review: `I was looking for a certain chair that I was having difficulty finding and thankfully saw the LazySuzy website.\n
      I received my chair a few days ago and I LOVE IT.. Perfect condition and perfectly handled... I will be shopping with them in the future for sure... Great company and Thank you Arzan and Allie !!`
        },
        {
            title: 'Great Site',
            writer: 'Yasmin',
            review:
                'Really helpful and courteous. Great to have an easy place for searching and browsing for our home!'
        },
        {
            title: 'I love my purchase!',
            writer: 'Sharon Mitchell',
            review: 'I love my purchase! Great product, great customer service, highly recommend!'
        },
        {
            title: 'Great customer service',
            writer: 'Pam',
            review: 'I was ecstatic to find components of the Pier 1 Imports papasan chair still in stock since Pier 1 is going out of business. Although the shipping was delayed for one product, customer service was fantastic with frequent communications on status and when products will arrive. Highly recommend LazySuzy, especially for difficult to find products'
        }
    ];

    boardViewLink = boardRoutesNames.BOARD_VIEW;
    displayBoardPath = 'assets/image/board_display.webp';
    trustPilotStarsPath = 'assets/image/trustpilot_stars.png';
    trustPilotLogoPath = 'assets/image/trustpilot_logo.png';

    constructor(
        private apiService: ApiService,
        private formBuilder: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private eventEmitterService: EventEmitterService,
        private route: ActivatedRoute,
        private router: Router,
        private boardService: BoardService,
        private seoService: SeoService
    ) {

    }

    ngOnInit() {
        this.seoService.setMetaTags({});
        this.eventSubscription = this.eventEmitterService.userChangeEvent
            .asObservable()
            .subscribe((user) => {
                this.emailForm = this.formBuilder.group({
                    email: ['', [Validators.required, Validators.email]]
                });
                this.bpSubscription = this.bpObserver.subscribe(
                    (handset: BreakpointState) => {
                        this.isHandset = handset.matches;
                    }
                );
            });
    }

    onDestroy(): void {
        this.eventSubscription.unsubscribe();
    }

    onSubmit(value: any) {
        this.apiService.getEmail().subscribe((res) => {
        });
    }

    newBoard() {
        const board: Board = new Board();
        const newBoard = Object.assign({}, board);
        newBoard.title = 'Untitled Board';

        newBoard.type_privacy = newBoard.is_published = 0;

        // tslint:disable-next-line: no-shadowed-variable
        this.boardService.addBoard(newBoard).subscribe((board) => {
            this.router.navigate(
                [['/board', this.boardViewLink, board.uuid].join('/')],
                {
                    relativeTo: this.route,
                    state: {
                        justCreated: true
                    }
                }
            );
        });
    }
}