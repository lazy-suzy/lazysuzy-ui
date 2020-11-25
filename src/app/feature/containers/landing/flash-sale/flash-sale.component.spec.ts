import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashSaleComponent } from './flash-sale.component';

describe('FlashSaleComponent', () => {
  let component: FlashSaleComponent;
  let fixture: ComponentFixture<FlashSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
