import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReviewsDesktopComponent } from './all-reviews-desktop.component';

describe('AllReviewsDesktopComponent', () => {
  let component: AllReviewsDesktopComponent;
  let fixture: ComponentFixture<AllReviewsDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllReviewsDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllReviewsDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
