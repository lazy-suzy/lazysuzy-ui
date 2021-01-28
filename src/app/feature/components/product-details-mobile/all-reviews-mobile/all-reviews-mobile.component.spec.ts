import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReviewsMobileComponent } from './all-reviews-mobile.component';

describe('AllReviewsMobileComponent', () => {
  let component: AllReviewsMobileComponent;
  let fixture: ComponentFixture<AllReviewsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllReviewsMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllReviewsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
