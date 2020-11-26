import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashSaleMobileProductComponent } from './flash-sale-mobile-product.component';

describe('FlashSaleMobileProductComponent', () => {
  let component: FlashSaleMobileProductComponent;
  let fixture: ComponentFixture<FlashSaleMobileProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashSaleMobileProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashSaleMobileProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
