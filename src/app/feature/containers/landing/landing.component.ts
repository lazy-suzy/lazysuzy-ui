import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './../../../shared/services';
import { Observable, Subscription } from 'rxjs';
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from '@angular/cdk/layout';
import { EventEmitterService } from 'src/app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { boardRoutesNames } from '../../../modules/board/board.routes.names';
import { BoardService } from '../../../modules/board/board.service';
import { Board } from '../../../modules/board/board';

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

  contentList = [
    'Design your space the way you want',
    'Mix and match various styles',
    'Easy drag & drop from our catalog',
    'Upload your own items',
    'Publish and share your work to inspire others'
  ];
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
    }
  ];
  boardViewLink = boardRoutesNames.BOARD_VIEW;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private eventEmitterService: EventEmitterService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService
  ) {}

  ngOnInit() {
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
    this.apiService.getEmail().subscribe((res) => {});
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
