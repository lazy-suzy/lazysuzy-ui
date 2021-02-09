import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsLoginComponent } from './order-details-login.component';

describe('OrderDetailsLoginComponent', () => {
  let component: OrderDetailsLoginComponent;
  let fixture: ComponentFixture<OrderDetailsLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
