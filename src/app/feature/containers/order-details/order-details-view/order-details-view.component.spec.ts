import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsViewComponent } from './order-details-view.component';

describe('OrderDetailsViewComponent', () => {
  let component: OrderDetailsViewComponent;
  let fixture: ComponentFixture<OrderDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
