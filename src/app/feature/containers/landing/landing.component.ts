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
  isHandset: boolean = false;
  eventSubscription: Subscription;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private eventEmitterService: EventEmitterService
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
  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
  onSubmit(value: any) {
    this.apiService.getEmail().subscribe((res) => {});
  }
}
