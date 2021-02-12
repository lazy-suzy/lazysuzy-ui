import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsMobileComponent } from './order-details-mobile.component';

describe('OrderDetailsMobileComponent', () => {
  let component: OrderDetailsMobileComponent;
  let fixture: ComponentFixture<OrderDetailsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
