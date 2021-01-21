import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormMobileComponent } from './reviewForm-mobile.component';

describe('ReviewFormMobileComponent', () => {
    let component: ReviewFormMobileComponent;
    let fixture: ComponentFixture<ReviewFormMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ReviewFormMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(ReviewFormMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
