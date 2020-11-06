import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDailogComponent } from './offer-dailog.component';

describe('OfferDailogComponent', () => {
  let component: OfferDailogComponent;
  let fixture: ComponentFixture<OfferDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
