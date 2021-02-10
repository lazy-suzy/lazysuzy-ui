import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsDesktopComponent } from './order-details-desktop.component';

describe('OrderDetailsDesktopComponent', () => {
  let component: OrderDetailsDesktopComponent;
  let fixture: ComponentFixture<OrderDetailsDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
