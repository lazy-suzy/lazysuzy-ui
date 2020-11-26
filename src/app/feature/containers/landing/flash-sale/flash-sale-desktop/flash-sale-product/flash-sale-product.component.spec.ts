import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashSaleProductComponent } from './flash-sale-product.component';

describe('FlashSaleProductComponent', () => {
  let component: FlashSaleProductComponent;
  let fixture: ComponentFixture<FlashSaleProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashSaleProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashSaleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
