import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDesktopComponent } from './review-desktop.component';

describe('ReviewDesktopComponent', () => {
  let component: ReviewDesktopComponent;
  let fixture: ComponentFixture<ReviewDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
